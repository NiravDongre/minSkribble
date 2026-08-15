import express from "express";
import WebSocket ,{ WebSocketServer } from "ws";
import cors from "cors";

const app = express();
app.use(cors());

const port = 8080
const httpServer = app.listen(port, () => {
    console.log(`The App is listening on ${port}`)
})

const mixedword = ["animals", "sport", "world", "trees", "jungle"];

function RandomWord(){
    return mixedword[Math.floor(Math.random() * mixedword.length)];
}

const word = RandomWord();

interface Rooms {
    sockets: WebSocket[] 
}

interface Client {
    username: string,
    Connection: WebSocket 
}

const client : Record<string, Client>= {}


function guid() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

const rooms : Record<string, Rooms> = {}

const wss = new WebSocketServer({ server: httpServer});

wss.on("connection", (ws) => {

const ConnectorId = guid();

console.log(`this is the id of ws i guess ${ConnectorId}`)
    
    ws.on("message", (data, isBinary) => {
        const message = isBinary ? data : data.toString()
        const parsedData  = JSON.parse(message as string);
        const roomId = parsedData.roomId;
        const username = parsedData.username;
    
        if(parsedData.type === "join-room"){
            if(!rooms[roomId]){
             rooms[roomId] = {
                sockets: []
             }
             client[roomId] = {
             username: username,
             Connection: ws
             }
            }
            console.log(`User ${parsedData.username} joined`)
                rooms[roomId].sockets.push(ws);

            const payload = {
                type: "connect",
                roomId: roomId,
                username: username,
                word: word
            }

            
            ws.send(JSON.stringify(payload))
        }

        if(parsedData.type === "chat-room"){

         const isCorrectGuess = parsedData.messages.trim().toLowerCase() === word?.toLowerCase();
        
            const BroadCastPayload = {
                type: "chat-room",
                roomId: roomId,
                username: username,
                messages: isCorrectGuess ? `${parsedData.username} has guessed the word`: parsedData.messages,
                isCorrect: isCorrectGuess
            }
            if(isCorrectGuess){
                console.log("Ohh you matched it right")
            } 
            rooms[roomId]?.sockets.forEach(socket => {
                    if(socket.readyState === WebSocket.OPEN){
                    socket.send(JSON.stringify(BroadCastPayload))
                };
            });
        }

        if(parsedData.type === "StartDraw"){
            const BroadCastPayload = {
                type: "StartDraw",
                username: username,
                roomId: roomId,
                x: parsedData.x,
                y: parsedData.y
            }
            rooms[roomId]?.sockets.forEach(socket => {
                    if(socket.readyState === WebSocket.OPEN){
                        if(socket == ws)return;
                    socket.send(JSON.stringify(BroadCastPayload))
                    } return;
             })
        }

        if(parsedData.type === "draw"){
            const BroadCastPayload = {
                type: "draw",
                username: username,
                roomId: roomId,
                x: parsedData.x,
                y: parsedData.y
            }
            rooms[roomId]?.sockets.forEach(socket => {
                    if(socket.readyState === WebSocket.OPEN){
                        if(socket == ws)return;
                    socket.send(JSON.stringify(BroadCastPayload))
                    } return;
             })
        }

        if(parsedData.type === "StopDraw" || parsedData.type === "LeaveDraw"){
            const BroadCastPayload = {
                type: "StopDraw",
                username: username,
                roomId: roomId
            }
            rooms[roomId]?.sockets.forEach(socket => {
            if(socket.readyState === WebSocket.OPEN){
                if(socket == ws)return;
            socket.send(JSON.stringify(BroadCastPayload))
            };
        })
    } 
})

})
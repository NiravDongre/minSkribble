import express from "express";
import WebSocket ,{ WebSocketServer } from "ws";
import cors from "cors";
import { Router } from "./routes/guessword";

const app = express();
app.use(cors());
app.use(Router);

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

const client : Record<string, { Connection: WebSocket }>= {}
const ConnectorId = guid();

function guid() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

const rooms : Record<string, Rooms> = {}

const wss = new WebSocketServer({ server: httpServer});

wss.on("connection", (ws) => {

    console.log(`Connection established with browser it's name or id is this ${ConnectorId}`)
    
    ws.on("message", (data, isBinary) => {

        const message = isBinary ? data : data.toString()
        const parsedData  = JSON.parse(message as string);
        const roomId = parsedData.roomId
    
        if(parsedData.type === "join-room"){
            if(!rooms[roomId]){
             rooms[roomId] = {
                sockets: []
             }
            }
            console.log(`User ${parsedData.clientId} joined`)
        rooms[roomId].sockets.push(ws)
        }

        if(parsedData.type === "chat-room"){

        const isCorrectGuess = parsedData.messages.trim().toLowerCase() === word?.toLowerCase();
        
            const BroadCastPayload = {
                type: "chat-room",
                clientId: parsedData.clientId,
                messages: isCorrectGuess ? `${parsedData.clientId} has guessed the word`: parsedData.messages,
                isCorrect: isCorrectGuess
            }
            if(isCorrectGuess){
                console.log("Ohh you matched it right")
            } 
            rooms[roomId]?.sockets.forEach(socket => {
                    if(socket.readyState === WebSocket.OPEN){
                    socket.send(JSON.stringify(BroadCastPayload))
                    } return;
             })
        }

        if(parsedData.type === "leave-room"){
            if(rooms[roomId]?.sockets){
            rooms[roomId].sockets = rooms[roomId]?.sockets.filter((socket) => { socket !== ws })} 
        }    
 })


    client[ConnectorId] = {
        "Connection": ws
    };

    const payload = {
        "type": "connect",
        "clientId": ConnectorId,
        "word": word
    }

    ws.send(JSON.stringify(payload))
})
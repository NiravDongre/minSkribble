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
    return mixedword[Math.floor(Math.random() * mixedword.length)] || "";
}

const word = RandomWord();

interface Rooms {
    Player: Client[],
    round: number,
    isCurrentlyDrawing: number,
    word: string
}

interface Client {
    id: string
    username: string,
    socket: WebSocket
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

console.log(`this is the id of player i guess ${ConnectorId}`)
    
    ws.on("message", (data, isBinary) => {
        const message = isBinary ? data : data.toString()
        const parsedData  = JSON.parse(message as string);
        const roomId = parsedData.roomId;
        const username = parsedData.username;
        const PlayerIndex = rooms[roomId]?.Player.findIndex(player =>  player.socket === ws);


        if(parsedData.type === "join-room"){

            if(!rooms[roomId]){
             rooms[roomId] = {
                Player: [],
                round: 3,
                isCurrentlyDrawing: 0,
                word: RandomWord()
             }
            }
            const detail = {
                id: ConnectorId,
                username: username,
                socket: ws
            }
            rooms[roomId].Player.push(detail);

            const payload = {
                type: "connect",
                roomId: roomId,
                username: username,
                word: rooms[roomId].word
            }

            ws.send(JSON.stringify(payload))

        }

        if(parsedData.type === "time"){

        const guessPayload = {
                type: "actual-word",
                roomId: roomId,
                username: username,
                word: rooms[roomId]?.word
        }

        function WordChanger(){
            let Timeleft = 80;
                let sec = setInterval(() => {
                        Timeleft--;

                    const TimingPayload = {
                        type: "time",
                        roomId: roomId,
                        round: rooms[roomId]?.round,
                        Timeleft: Timeleft
                    }
                    ws.send(JSON.stringify(TimingPayload))
                    if(Timeleft === 0){
                        rooms[roomId]?.Player.forEach((clients) => {
                            if(clients.socket.readyState === WebSocket.OPEN){
                                if(clients.socket == ws) return;
                                ws.send(JSON.stringify(guessPayload))
                                return clearInterval(sec);
                            }
                        })
                    }
                }, 1000)
            }
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
            rooms[roomId]?.Player.forEach(player => {
                    if(player.socket.readyState === WebSocket.OPEN){
                    player.socket.send(JSON.stringify(BroadCastPayload))
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
            if(PlayerIndex !== rooms[roomId]?.isCurrentlyDrawing){
                return;
            }
            rooms[roomId]?.Player.forEach(player => {
                    if(player.socket.readyState === WebSocket.OPEN){
                        if(player.socket == ws)return;
                    player.socket.send(JSON.stringify(BroadCastPayload))
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
            if(PlayerIndex !== rooms[roomId]?.isCurrentlyDrawing){
                return;
            }
            rooms[roomId]?.Player.forEach(player => {
                    if(player.socket.readyState === WebSocket.OPEN){
                        if(player.socket == ws)return;
                    player.socket.send(JSON.stringify(BroadCastPayload))
                    } return;
             })
        }

        if(parsedData.type === "StopDraw" || parsedData.type === "LeaveDraw"){
            const BroadCastPayload = {
                type: "StopDraw",
                username: username,
                roomId: roomId
            }
            if(PlayerIndex !== rooms[roomId]?.isCurrentlyDrawing){
                return;
            }
            rooms[roomId]?.Player.forEach(player => {
            if(player.socket.readyState === WebSocket.OPEN){
                if(player.socket == ws)return;
            player.socket.send(JSON.stringify(BroadCastPayload))
            };
        })
    } 
})

})
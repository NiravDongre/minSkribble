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


interface Rooms {
    Player: Client[],
    round: number,
    isCurrentlyDrawing: number,
    word: string,
    timer: number
}

interface Client {
    id: string
    username: string,
    socket: WebSocket
}

const client = 8;

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
                round: 1,
                isCurrentlyDrawing: 0,
                word: RandomWord(),
                timer: 80
             }
            }

            const detail = {
                id: ConnectorId,
                username: username,
                socket: ws
            }

            rooms[roomId].Player.push(detail);

            if(PlayerIndex !== rooms[roomId].isCurrentlyDrawing){
                const payload = {
                    type: "connect",
                    roomId: roomId,
                    username: username,
                }
                rooms[roomId].Player.forEach(clients => {
                    if(clients.socket.readyState === WebSocket.OPEN){
                        clients.socket.send(JSON.stringify(payload))
                    }
                })
            } else {
                const payload = {
                    type: "connect",
                    roomId: roomId,
                    username: username,
                    word: rooms[roomId].word
                }

                rooms[roomId]?.Player.forEach(player => {
                    if(player.socket.readyState === WebSocket.OPEN){
                        if(player.socket == ws){
                            player.socket.send(JSON.stringify(payload))
                        }
                    }
                }) 
            }
        }

        if(parsedData.type === "start-play"){
            
            const Twoplayer = {
                type: "need-player",
                roomId: roomId
            }

            if(PlayerIndex !== rooms[roomId]?.isCurrentlyDrawing) return;

            if(!(rooms[roomId] && rooms[roomId].Player.length > 2)){
                rooms[roomId]?.Player.forEach(prev => {
                    if(prev.socket.readyState === WebSocket.OPEN){
                        prev.socket.send(JSON.stringify(Twoplayer))
                    }
                })
            }else{
                WordChanger();

                const guessPayload = {
                        type: "actual-word",
                        roomId: roomId,
                        username: username,
                        word: rooms[roomId]?.word
                }

            function WordChanger(){

                    let sec = setInterval(() => {

                        if(!rooms[roomId]) return;
                        rooms[roomId].timer--;

                        const TimingPayload = {
                            type: "time",
                            roomId: roomId,
                            round: rooms[roomId]?.round,
                            Timeleft: rooms[roomId]?.timer
                        }
                        rooms[roomId]?.Player.forEach((client) => {
                             if(client.socket.readyState === WebSocket.OPEN){
                                    client.socket.send(JSON.stringify(TimingPayload))
                                }
                        })
                        if(rooms[roomId].timer === 0){
                            clearInterval(sec);
                            rooms[roomId]?.Player.forEach((clients) => {
                                if(clients.socket.readyState === WebSocket.OPEN){
                                    if(clients.socket == ws) return;
                                    clients.socket.send(JSON.stringify(guessPayload))
                                }
                            })

                            if(rooms[roomId]){
                                rooms[roomId].round += 1;
                                rooms[roomId].isCurrentlyDrawing = (rooms[roomId].isCurrentlyDrawing + 1) % rooms[roomId].Player.findIndex(people => people.socket);
                                if(rooms[roomId].round === 5){
                                    ws.send(JSON.stringify("who is winner right"))
                                }
                                rooms[roomId].word = RandomWord()
                            }
                        }
                    }, 1000)
                }
            }
        }

        if(parsedData.type === "chat-room"){

         const isCorrectGuess = parsedData.messages.trim().toLowerCase() === rooms[roomId]?.word.toLowerCase();
        
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
                }
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
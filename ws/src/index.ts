import express from "express";
import WebSocket ,{ WebSocketServer } from "ws";

const app = express();
const port = 8080
const httpServer = app.listen(port, () => {
    console.log(`The App is listening on ${port}`)
})

interface Rooms {
    sockets: WebSocket[]
}

const rooms : Record<string, Rooms> = {}

const wss = new WebSocketServer({ server: httpServer});

wss.on("connection", (ws) => {
    console.error(Error);
    
    ws.on("message", (data) => {
        const parsedData  = JSON.parse(data.toString());
        const roomId = parsedData.roomId
        if(parsedData.type === "join-room"){
            if(!rooms[roomId]){
             rooms[roomId] = {
                sockets: []
             }
            }
            rooms[roomId].sockets.push(ws)
        }
        if(parsedData.type === "chat-room"){
            rooms[roomId]?.sockets.forEach(socket =>{
                if(socket == ws) return;
                socket.send(data)
            })
        }
        if(parsedData.type === "leave-room"){
            rooms[roomId]?.sockets.filter(vlae => {
                if(vlae !== ws)return;
                rooms[roomId]?.sockets.pop(ws)
            })
        }
    })
})
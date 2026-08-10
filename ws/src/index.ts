import express from "express";
import WebSocket ,{ WebSocketServer } from "ws";
import cors from "cors";

const app = express();
app.use(cors())
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
            console.log(`User ${parsedData.userId} joined`)
        rooms[roomId].sockets.push(ws)
    }

        if(parsedData.type === "chat-room"){
            rooms[roomId]?.sockets.forEach(socket =>{
                if(socket == ws) return;
                socket.send(message)
            })
        console.log(parsedData.messages)
    }

        if(parsedData.type === "leave-room"){
            if(rooms[roomId]?.sockets){
                rooms[roomId].sockets = rooms[roomId]?.sockets.filter((socket) => {
                socket !== ws
            })
        }
    }
    })
})
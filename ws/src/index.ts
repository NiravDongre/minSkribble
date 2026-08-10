import express, { json } from "express";
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
            rooms[roomId]?.sockets.forEach(socket =>{
                socket.send(JSON.stringify(parsedData))
            })
        console.log(parsedData.messages)
    }

        if(parsedData.type === "leave-room"){
            if(rooms[roomId]?.sockets){
            rooms[roomId].sockets = rooms[roomId]?.sockets.filter((socket) => { socket !== ws })
        }
    }
    })

    client[ConnectorId] = {
        "Connection": ws
    };

    const payload = {
        "type": "connect",
        "clientId": ConnectorId
    }

    ws.send(JSON.stringify(payload))
})
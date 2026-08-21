import dotenv from "dotenv";
dotenv.config();
import express from "express";
import WebSocket ,{ WebSocketServer } from "ws";
import cors from "cors";

interface ExtendedWebSocket extends WebSocket {
    roomId: string;
}

const app = express();
app.use(cors({
    origin: "https://minskribble-gamma.vercel.app/"
}))

const port = process.env.PORT || 8080
const httpServer = app.listen(port, () => {
    console.log(`The App is listening on ${port}`)
})

const mixedword = [
  "Elephant",
  "Lion",
  "Tiger",
  "Monkey",
  "Penguin",
  "Giraffe",
  "Zebra",
  "Kangaroo",
  "Crocodile",
  "Octopus",
  "Shark",
  "Whale",
  "Butterfly",
  "Spider",
  "Bee",
  "Snake",
  "Turtle",
  "Rabbit",
  "Horse",
  "Cow",

  "Train",
  "Bus",
  "Motorcycle",
  "Submarine",
  "Tractor",
  "Ambulance",
  "Police Car",
  "Fire Truck",
  "Hot Air Balloon",
  "Spacesuit",

  "Beach",
  "Mountain",
  "Waterfall",
  "Forest",
  "Desert",
  "Island",
  "River",
  "Bridge",
  "Park",
  "Playground",

  "Ice Cream",
  "Burger",
  "Hot Dog",
  "Sandwich",
  "Donut",
  "Cake",
  "Popcorn",
  "Watermelon",
  "Strawberry",
  "Chocolate",

  "Crown",
  "Sword",
  "Shield",
  "Magic Wand",
  "Treasure Chest",
  "Pirate Ship",
  "Wizard",
  "Ghost",
  "Vampire",
  "Witch",

  "Football",
  "Basketball",
  "Tennis",
  "Cricket",
  "Baseball",
  "Swimming",
  "Boxing",
  "Bowling",
  "Skating",
  "Surfing",

  "Clock",
  "Key",
  "Lock",
  "Backpack",
  "Glasses",
  "Watch",
  "Toothbrush",
  "Mirror",
  "Magnet",
  "Flashlight",

  "Birthday Party",
  "Wedding",
  "Camping Trip",
  "Road Trip",
  "Space Station",
  "Movie Theater",
  "Amusement Park",
  "Zoo",
  "School Bus",
  "Supermarket"
]

function RandomWord(){
    return mixedword[Math.floor(Math.random() * mixedword.length)] || "";
}

interface Rooms {
    Player: Client[],
    round: number,
    isCurrentlyDrawing: number,
    word: string,
    timer: number,
    isRoundRunning: boolean
}

interface Client {
    id: string
    username: string,
    socket: WebSocket,
    points: number,
    isHost: boolean
}

const client = 8;

function guid() {
    var S4 = function() { return (((1+Math.random())*0x10000)|0).toString(16).substring(1); };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

const rooms : Record<string, Rooms> = {}
const wss = new WebSocketServer({ server: httpServer});

wss.on("connection", (ws: ExtendedWebSocket) => {
const ConnectorId = guid();

console.log(`this is the id of player i guess ${ConnectorId}`)
    
    ws.on("message", (data, isBinary) => {
        const message = isBinary ? data : data.toString()
        const parsedData  = JSON.parse(message as string);
        const roomId = parsedData.roomId;
        const username = parsedData.username;
        ws.roomId = roomId;

        if(parsedData.type === "join-room"){
            if(!rooms[roomId]){
             rooms[roomId] = {
                Player: [],
                round: 1,
                isCurrentlyDrawing: 0,
                isRoundRunning: false,
                word: RandomWord(),
                timer: 80
             }
            }

            const detail = {
                id: ConnectorId,
                username: username,
                socket: ws,
                points: 75
            }
            
            if (rooms[roomId].Player.length === client){
                ws.send(JSON.stringify("No more people can join the room pls create another room by diff name"))
            }

                const isHost = rooms[roomId].Player.length === 0;
            rooms[roomId].Player.push({...detail, isHost});
            
            const PlayerIndex = rooms[roomId].Player.findIndex(player =>  player.socket === ws);
                

                rooms[roomId].Player.forEach((clients) => {
                    clients.socket.send(JSON.stringify({
                        type: "host-is",
                        roomId: roomId,
                        isHost: clients.isHost
                    }))
                })

                const addload = {
                    type: "add-type",
                    roomId: roomId,
                    id: rooms[roomId].Player[PlayerIndex]?.id,
                    username: username,
                    points: rooms[roomId].Player[PlayerIndex]?.points
                }

                rooms[roomId].Player.forEach(clients => {
                    if(clients.socket.readyState === WebSocket.OPEN){
                        clients.socket.send(JSON.stringify(addload))
                }
            })
        }

        if(parsedData.type === "start-play"){
            if(!rooms[roomId]) return;
                const PlayerIndex = rooms[roomId].Player.findIndex(player =>  player.socket === ws);

            if(rooms[roomId].isRoundRunning  === false){

                if(PlayerIndex !== rooms[roomId]?.isCurrentlyDrawing) return;

                if(!(rooms[roomId] && rooms[roomId].Player.length >= 2)){
                    rooms[roomId]?.Player.forEach(prev => {
                        const Twoplayer = {
                            type: "need-player",
                            roomId: roomId,
                            message: "Need more player for starting"
                        }
                        if(prev.socket.readyState === WebSocket.OPEN){
                            prev.socket.send(JSON.stringify(Twoplayer))
                        }
                    })
                } 
                else {
                    
                rooms[roomId].isRoundRunning = true;

                const currentDrawer = rooms[roomId].Player[rooms[roomId].isCurrentlyDrawing];
                if(!currentDrawer) return;
                rooms[roomId].Player.forEach(player => {
                    const rolePayload = {
                        type: "player-role",
                        roomId: roomId,
                        isDrawer: player.socket === currentDrawer.socket,
                        round: rooms[roomId]?.round,
                        word: player.socket === currentDrawer.socket
                            ? rooms[roomId]?.word
                            : undefined
                    };

                    if (player.socket.readyState === WebSocket.OPEN) {
                        player.socket.send(JSON.stringify(rolePayload));
                    }
                });
                
                    WordChanger();
                        const guessPayload = {
                                type: "actual-word",
                                roomId: roomId,
                                username: username,
                                word: rooms[roomId].word
                        }

                        function WordChanger(){

                            let sec = setInterval(() => {

                                if(!rooms[roomId]) return;
                                rooms[roomId].timer--;

                                const TimingPayload = {
                                    type: "time",
                                    roomId: roomId,
                                    Timeleft: rooms[roomId].timer
                                }
                                rooms[roomId].Player.forEach((client) => {
                                    if(client.socket.readyState === WebSocket.OPEN){
                                        client.socket.send(JSON.stringify(TimingPayload))
                                    }
                                })
                                if(rooms[roomId].timer <= 0){
                                    clearInterval(sec);
                                    rooms[roomId].Player.forEach((clients) => {
                                        if(clients.socket.readyState === WebSocket.OPEN){
                                            if(clients.socket == ws) return;
                                            clients.socket.send(JSON.stringify(guessPayload))
                                        }
                                    })
                                            rooms[roomId].isRoundRunning = false;
                                            rooms[roomId].word = RandomWord()
                                            rooms[roomId].round += 1
                                            rooms[roomId].isCurrentlyDrawing = (rooms[roomId].isCurrentlyDrawing + 1) % rooms[roomId].Player.length;
                                            rooms[roomId].timer = 80;
                                            const isDrawer = rooms[roomId].Player[rooms[roomId].isCurrentlyDrawing]


                                            const ClearCanvas = {
                                                type: "clear-canvas",
                                                roomId: roomId
                                            }

                                            rooms[roomId].Player.forEach((clients) => {
                                                clients.socket.send(JSON.stringify(ClearCanvas))
                                            })
                                            
                                        if(rooms[roomId].round > 5){
                                            rooms[roomId].Player.forEach(clients => {
                                                const messages = {
                                                    type: "Game-Over",
                                                    roomId: roomId,
                                                    message: "The game is ending thank you for your experience"
                                                }
                                                clients.socket.send(JSON.stringify(messages))
                                            })

                                            rooms[roomId].Player.forEach( clients => {
                                                clients.socket.close()
                                            })

                                            delete rooms[roomId]
                                            return;
                                        } else{
                                        rooms[roomId].Player.forEach((clients) => {
                                                const playerPayload = {
                                                type: "new-Drawer",
                                                roomId: roomId,
                                                round: rooms[roomId]?.round,
                                                isDrawer: clients.socket == isDrawer?.socket,
                                                Drawer: isDrawer?.username,
                                                time: rooms[roomId]?.timer,
                                                word: clients.socket == isDrawer?.socket ? rooms[roomId]?.word : undefined
                                            }
                                            clients.socket.send(JSON.stringify(playerPayload))
                                        }) 
                                    }
   
                                }
                            }, 1000)
                        }
                    }
            } else {
                
                const payload = {
                    type: "already-started",
                    roomId: roomId,
                    message: "The button is already pressed"
                }

                rooms[roomId].Player.forEach(clients => {
                    if(clients.socket.readyState === WebSocket.OPEN){
                        if(clients.socket === ws){
                            clients.socket.send(JSON.stringify(payload))
                        }
                    }
                })
            }
           
        }

        if(parsedData.type === "erase-canvas"){
            const ClearCanvas = {
                type: "clear-canvas",
                roomId: roomId
            }

            rooms[roomId]?.Player.forEach((clients) => {
                clients.socket.send(JSON.stringify(ClearCanvas))
            })
        }

        if(parsedData.type === "chat-room"){
            if(!rooms[roomId]) return;
            const PlayerIndex = rooms[roomId].Player.findIndex(player =>  player.socket === ws);

            if(!rooms[roomId]) return;   

         const isCorrectGuess = parsedData.messages.trim().toLowerCase() === rooms[roomId]?.word.toLowerCase();
        
            const BroadCastPayload = {
                type: "chat-room",
                roomId: roomId,
                username: username,
                messages: isCorrectGuess ? `${parsedData.username} has guessed the word`: parsedData.messages,
                isCorrect: isCorrectGuess
            }
            if(isCorrectGuess && PlayerIndex !== -1){
                if(!rooms[roomId].Player[PlayerIndex])return;

                rooms[roomId].Player[PlayerIndex].points +=50;

                const pointload = {
                    type: "pointplus",
                    roomId: roomId,
                    id: rooms[roomId].Player[PlayerIndex].id,
                    username: username,
                    points: rooms[roomId].Player[PlayerIndex].points
                }

                rooms[roomId].Player.forEach((clients) => {
                    clients.socket.send(JSON.stringify(pointload))
                })

                console.log("Ohh you matched it right")
            } 
            rooms[roomId]?.Player.forEach(player => {
                    if(player.socket.readyState === WebSocket.OPEN){
                    player.socket.send(JSON.stringify(BroadCastPayload))
                };
            });
        }

        if(parsedData.type === "StartDraw"){
        const PlayerIndex = rooms[roomId]?.Player.findIndex(player =>  player.socket === ws);

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
        const PlayerIndex = rooms[roomId]?.Player.findIndex(player =>  player.socket === ws);

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
            const PlayerIndex = rooms[roomId]?.Player.findIndex(player =>  player.socket === ws);

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


        if(parsedData.type === "leave-room"){
            console.log("reached here right")
            if(!rooms[roomId]) return;
            const PlayerIndex = rooms[roomId].Player.findIndex(prev => prev.socket === ws);

            if(PlayerIndex === -1) return;

            rooms[roomId].Player.splice(PlayerIndex, 1);

            const LeaveRoom = {
                type: "leave-room",
                roomId: roomId
            }

            ws.send(JSON.stringify(LeaveRoom))

            rooms[roomId].Player.forEach((clients) => {
                clients.socket.send(JSON.stringify({
                    type: "player-left",
                    roomId: roomId,
                    username: clients.username
                }))
            })

            if(rooms[roomId].Player.length === 0){
                rooms[roomId].timer = 0;
                delete rooms[roomId]
            }
        }
    })

    ws.on("close", () => {
        const roomId = ws.roomId
        if(!rooms[roomId]) return;
        const PlayerIndex = rooms[roomId].Player.findIndex(prev => prev.socket === ws);

        if(PlayerIndex === -1) return;
        rooms[ws.roomId]?.Player.splice(PlayerIndex, 1);

        if (rooms[roomId].Player.length === 0) {
            delete rooms[roomId];
        }
    })
})

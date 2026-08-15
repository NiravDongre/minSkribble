import { useEffect, useState } from "react"
import Canvas from "../Component/Canvas"
import Chat from "../Component/Chat";
import LeaderBoard from "../Component/LeaderBoard";
import { useLocation } from "react-router-dom";
const something = new WebSocket("ws://localhost:8080");

export default function Main(){
  const location = useLocation();
  const [ messages , setMessages] = useState([]);
  const [ Socket, setSocket ] = useState<WebSocket | null>(null);
  const [ word, setWord ] = useState("")
  const { username, roomId } = location.state || { username: "", roomId: "" }



  useEffect(() => {

    if(!something) return;

    something.onmessage = (message) => {
      const response = JSON.parse(message.data);

      if(response.type === "connect"){
        setWord(response.word)
        console.log(`Connection established Successfully`)
      }

    console.log(response.messages)
      if(response.type === "chat-room"){
        const messages = response.messages;
        const user = response.username;

        setMessages(prev => [...prev,{ sender: user, text:messages}])
      }
    }

    setSocket(something);

      if(something.readyState === WebSocket.OPEN) {
      const payload = {
        type: "join-room",
        roomId: roomId,
        username: username
      };
      something.send(JSON.stringify(payload));
    } else {
      something.onopen = () => {
        const payload = {
          type: "join-room",
          roomId: roomId,
          username: username
        };
        something.send(JSON.stringify(payload));
      };
    }

    return () => {
    something.onmessage = null;  
  }

  }, [setMessages])

    if(Socket == null){
      return <div className="h-screen flex justify-center items-center">
        ...Loading
      </div>
    }

  return (
    <div>
      <div className="text-center">
        Guess the word : {word}
      </div>
 <div className="h-screen flex justify-between items-center">
    
    <div className="text-sm text-gray-500 text-center">
      Room: {roomId} | Player: {username}
    </div>

    {Socket ? (
        <Canvas Socket={Socket} username={username} roomId={roomId} />
    ) : (
        <div>Connecting to whiteboard server...</div>
    )}

      <div className="h-full p-10 flex justify-center items-center">

      <div className="bg-blue-400 rounded-xl h-[800px] w-[400px] flex flex-col justify-between p-4">
        
        {/* 1. Scrollable message logs area at the top */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2 mb-4">
           {messages.length === 0 ? (
            <div className="text-sm text-center my-auto opacity-60 italic">Send a message to start guessing...</div>
          ) : (
            // 4. FIX: Use lowercase messages state array here
            messages.map((msg, index) => (
              <div key={index} className="p-3 rounded-xl bg-blue-300 text-slate-900 font-medium self-start max-w-[90%] shadow-sm">
                <strong>{msg.sender}:</strong> {msg.text}
              </div>
            ))
          )}
        </div>

        {/* 2. Interactive user inputs bar at the absolute bottom */}
        <div className="text-white">
          <Chat Socket={Socket} roomId={roomId} username={username}/>
        </div>

      </div>

      </div>

     </div>
    </div>
  )
}
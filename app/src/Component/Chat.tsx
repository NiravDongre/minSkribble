import { useState } from "react";

interface Chatter {
  Socket: WebSocket,
  username: string,
  roomId: string
}

function Chat({Socket, username, roomId}: Chatter){

  const [ Input, setInput ] = useState("");

  function handle(){
      console.log("button clicked")

      if(!Input.trim()) return;

      const payload = {
        "type": "chat-room",
        "roomId": roomId,
        "username": username,
        "messages": Input
      }
      Socket.send(JSON.stringify(payload))
      setInput("")
    }

  return (
    <div className="flex justify-between">
        <input  
          value={Input || ""}
          onChange={(e) => {
          setInput(e.target.value)}} 
          type="text" 
          placeholder="Chat" 
          className="p-4 bg-blue-800 outline-none text-slate-300 rounded-xl"
        />
      
  <button onClick={handle} className="bg-white rounded-xl text-black p-4">Send
  </button>
</div>
  )
}

export default Chat

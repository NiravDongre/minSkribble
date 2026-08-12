import { memo, useState } from "react";

interface Chatter {
  Socket: WebSocket,
  clientId: string
}

function Chat({Socket, clientId}: Chatter){
    const [ Input, setInput ] = useState("");

  return (
    <div className="flex justify-between">
        <input onChange={(e) => {
    setInput(e.target.value)
      }} type="text" placeholder="Chat" className="p-4 bg-blue-800 outline-none text-slate-300 rounded-xl" />
      
  <button onClick={() => {
              console.log("button clicked")
              const payload = {
                "type": "chat-room",
                "roomId": "1234",
                "clientId": clientId,
                "messages": Input
              }
              Socket.send(JSON.stringify(payload))
          }} className="bg-white rounded-xl text-black p-4">Send
  </button>
</div>
  )
}

export default memo(Chat)

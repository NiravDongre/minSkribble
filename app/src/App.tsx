import { useEffect, useState } from "react"
import Canvas from "./Component/Canvas"

const something = new WebSocket("ws://localhost:8080");

function App(){
  const clientId = "124343";
  const [ Messages , setMessages] = useState([]);
  const [ Socket, setSocket ] = useState<WebSocket | null>(null);

  if(!Socket == null){
    return <div className="h-screen flex justify-center items-center">
      ...Loading
    </div>
  }

  useEffect(() => {

    something.onopen = () => {
      const payload = {
        "type": "join-room",
        "roomId": "1234",
        "clientId": clientId
      }

        something.send(JSON.stringify(payload));
      console.log("Connecting on now you can try sending messages")
    }

    something.onmessage = (message) => {
      const response = JSON.parse(message.data);

      if(response.type === "connect"){
        console.log(`Connection established the id is ${response.clientId}`)
      }

      if(response.type === "chat-room"){
        setMessages(prev => [...prev, response.messages])
        console.log(`The answer you get in input is ${response.messages}`)
      }
    }
    setSocket(something);

    return () => {
    something.onclose = () => {
      console.log("Connection closed")
    }}

  }, [])

  return (
    <div>
      <Something />
          <div className="h-screen flex justify-between items-center">
            <div>
              <div>
              Leader : Nirav <br/>
              Player: Nirav 
              </div>
              <div>
              Player: Sumedh
              </div>
              <div>
              Player: lirili larilla 
              </div>
            </div>
          <Canvas />

      <div className="h-full p-10 flex justify-center items-center">
            <div className="bg-blue-400 rounded-xl h-[800px] w-[400px]">
              <div className="flex flex-col mt-auto text-white p-2">
                <Chat Socket={Socket} clientId={clientId}/>
              </div>

              <div className="p-2 flex flex-col gap-4">
                {Messages.map(allmessages => {
                  const keydrop = Math.random()*100000
                  return(
                    <div key={keydrop} className="p-3 rounded-xl bg-blue-300">
                      {allmessages}
                    </div>
                  )
                })}
              </div>

            </div>
      </div>

          </div>
    </div>
  )
}

function Something(){

  const [ word, setWord ] = useState("")

    useEffect(() => {
      something.onmessage = (message) => {
        const response = JSON.parse(message.data);
        console.log(response)
        if(response.type === "connect"){
          setWord(response.word)
        }
        console.log(response.word)
      }

      if(something.onmessage = null){
      return () => {
        something.onclose = () => {
          console.log("Connection closed")
        }}
      }

    },[])

return (
      <div className="text-center">
        Guess the word : {word}
      </div>
    )
}

function Chat({Socket, clientId}){
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


export default App
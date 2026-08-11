import { useEffect, useState } from "react"
import Canvas from "./Component/Canvas"
import Chat from "./Component/Chat";

const something = new WebSocket("ws://localhost:8080");

function App(){
  const clientId = "124343";
  const [ Messages , setMessages] = useState([]);
  const [ Socket, setSocket ] = useState<WebSocket | null>(null);
  const [ word, setWord ] = useState("")

  if(!Socket == null){
    return <div className="h-screen flex justify-center items-center">
      ...Loading
    </div>
  }

  useEffect(() => {


    const JoinRoom = () => {
      const payload = {
        "type": "join-room",
        "roomId": "1234",
        "clientId": clientId
      }

        something.send(JSON.stringify(payload));
      console.log("Joined Room successfully")
    }

    if(something.readyState === WebSocket.OPEN){
      JoinRoom()
    } else {
      something.onopen = JoinRoom;
    }

    something.onmessage = (message) => {
      const response = JSON.parse(message.data);
      console.log(response)
      
      if(response.type === "connect"){
        setWord(response.word)
        console.log(`Connection established the id is ${response.clientId}`)
      }

      if(response.type === "chat-room"){
        console.log(response)
        setMessages(prev => [...prev, response.messages])
        console.log(`The answer you get in input is ${response.messages}`)
      }
    }
    setSocket(something);

    return () => {
    something.onmessage = null;  
    something.onclose = () => {
      console.log("Connection closed")
    }}

  }, [setSocket, clientId])

  return (
    <div>
      <div className="text-center">
        Guess the word : {word}
      </div>
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
                {Messages.map((msg, index) => {
                  console.log(msg)
                  return(
                    <div key={index} className="p-3 rounded-xl bg-blue-300">
                      {msg}
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



export default App
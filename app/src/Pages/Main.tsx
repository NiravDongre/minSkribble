import { useEffect, useState } from "react"
import Canvas from "../Component/Canvas"
import Chat from "../Component/Chat";
import LeaderBoard from "../Component/LeaderBoard";



export default function Main({something}){
  const username = "124343";
  const [ Messages , setMessages] = useState([]);
  const [ Socket, setSocket ] = useState<WebSocket | null>(null);
  const [ word, setWord ] = useState("")



  useEffect(() => {

    something.onmessage = (message) => {
      const response = JSON.parse(message.data);
      
      if(response.type === "connect"){
        setWord(response.word)
        console.log(`Connection established the id is ${response.username}`)
      }

      if(response.type === "chat-room"){
        setMessages(prev => [...prev, response.messages])
      }
    }
    setSocket(something);

    return () => {
    something.onmessage = null;  
    something.onclose = () => {
      console.log("Connection closed")
    }}

  }, [setSocket, username])

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
  <LeaderBoard Socket={Socket} />
{Socket ? (
    <Canvas Socket={Socket} username={username} />
) : (
    <div>Connecting to whiteboard server...</div>
)}


      <div className="h-full p-10 flex justify-center items-center">
            <div className="bg-blue-400 rounded-xl h-[800px] w-[400px]">
              <div className="flex flex-col mt-auto text-white p-2">
                <Chat Socket={Socket} username={username}/>
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
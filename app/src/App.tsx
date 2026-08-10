import { useEffect, useState } from "react"
import Canvas from "./Component/Canvas"


function App(){

  const [ Messages , setMessages] = useState("");


  useEffect(() => {
    const something = new WebSocket("ws://localhost:8080");
    something.onopen = () => {
      console.log("It's on the websocket is!!!!")
    }

    something.onmessage = (message) => {
      const response = JSON.stringify(message.data)
      console.log(response)
    }
  }, [])

  return (
    <div>
      <div className="text-center">
        Guess the word : g_h_r
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
                  <input type="text" placeholder="Chat" className="p-4 bg-blue-800 outline-none text-slate-300 rounded-xl" />
                  </div>
                </div>
          </div>
          </div>
    </div>
  )
}

export default App
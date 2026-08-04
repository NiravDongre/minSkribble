import { useState } from "react"
import Canvas from "./Component/Canvas"


function App(){

  const [ word, setWord ] = useState("")
  return (
    <div>
      <div className="text-center">
        Guess the word : {word}
      </div>
          <div className="h-screen flex justify-between items-center">
            <div>
              <div>
              Leader : 1 <br/>
              name: Nirav 
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
                <div className="bg-blue-400 rounded-xl h-[800px] w-[400px]"></div>
          </div>
          </div>
    </div>
  )
}



export default App
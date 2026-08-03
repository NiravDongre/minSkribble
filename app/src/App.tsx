import { useState } from "react"




function App(){

  const [ something , setSomething ] = useState("");

  return (
    <div className="h-screen flex justify-center items-center">
      
      <canvas id="Canvas" className="h-full w-full bg-slate-300">
      </canvas>
    </div>
  )
}



export default App
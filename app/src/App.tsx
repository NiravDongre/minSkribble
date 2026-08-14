import { BrowserRouter, Route, Routes } from "react-router-dom"
import Room from "./Pages/Room"
import Main from "./Pages/Main"
const something = new WebSocket("ws://localhost:8080");

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Room  something={something} />}/>
        <Route path="/game" element={<Main something={something} />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Room from "./Pages/Room"
import Main from "./Pages/Main"


function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Room />}/>
        <Route path="/game" element={<Main />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
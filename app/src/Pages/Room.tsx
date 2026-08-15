import { memo, useState } from "react";
import backgroundurl from "../assets/join-room-bg.jpg"
import { useNavigate } from "react-router-dom";



const Room = () => {

    const navigate = useNavigate();
    const [ RoomId, setRoomId ] = useState("");
    const [ UserName, setUserName ] = useState("");

 const JoinRoom = () => {
        navigate("/game", {state: { username: UserName, roomId: RoomId}})
}


    return (
        <div className="bg-cover bg-center bg-no-repeat h-screen w-screen flex justify-center items-center"
        style={{ backgroundImage: `url(${backgroundurl})` }}
        >
            <div className="p-2 bg-blue-300 rounded-xl">
                <div className="p-2">
                   <span className="p-2 font-bold">Put Room Id you want to join or create it</span>
                    <input onChange={(e) => {
                        setRoomId(e.target.value)
                    }} type="text" className="p-2 outline-none bg-yellow-300 rounded" placeholder="RoomId" />
                </div>
                <div className="p-2">
                    <span className="p-2 font-bold">Put your UserName</span>
                    <input onChange={(e) => {
                        setUserName(e.target.value)
                    }} type="text" className="p-2 outline-none bg-yellow-300 rounded" placeholder="username"/>
                </div>
                <div className="p-2 flex justify-center">
                  <button onClick={() => {
                    JoinRoom()
                  }} className="bg-blue-800 rounded-xl p-4 cursor-pointer text-blue-300 font-semibold">Join room</button>
                </div>
            </div>
        </div>
    )
}
export default memo(Room)
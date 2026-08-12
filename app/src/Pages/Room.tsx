import { useState } from "react";
import backgroundurl from "../assets/join-room-bg.jpg"
import { useNavigate } from "react-router-dom";



export default function Room (){

    const navigate = useNavigate();
    const [ RoomId, setRoomId ] = useState("");
    const [ UserName, setUserName ] = useState("");

    return (
        <div className="bg-cover bg-center bg-no-repeat h-screen w-screen flex justify-center items-center"
        style={{ backgroundImage: `url(${backgroundurl})` }}
        >
            <div className="p-2 bg-blue-300 rounded-xl">
                <div className="p-2">
                   <span className="p-2 font-bold">Put Room Id you want to join or create it</span>
                    <input type="text" className="p-2 outline-none bg-yellow-300 rounded" placeholder="RoomId" />
                </div>
                <div className="p-2">
                    <span className="p-2 font-bold">Put your UserName</span>
                    <input type="text" className="p-2 outline-none bg-yellow-300 rounded" placeholder="username"/>
                </div>
                <div className="p-2 flex justify-center">
                    <button className="bg-blue-800 rounded-xl p-4 cursor-pointer text-blue-300 font-semibold">Join room</button>
                </div>
            </div>
        </div>
    )
}
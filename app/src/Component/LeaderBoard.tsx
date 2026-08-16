import { useEffect, useState } from "react";

interface Board {
    Socket: WebSocket,
    roomId: string
}
 
export default function LeaderBoard({Socket, roomId} : Board){

    console.log("hl")
    const [ allUser, setAllUser ] = useState([]);

    useEffect(() => {

    const handleUser = (messages) => {
        const data = JSON.parse(messages.data);
        if(data.type === "connect"){
            console.log("heloo")
            setAllUser(prev =>  [...prev, data.username])
        }
    }
        Socket.addEventListener("message", handleUser)

        return () => {
            Socket.removeEventListener("message", handleUser);
        };


    }, [Socket])


    return (
        <div>
    <div className="text-sm text-gray-500 text-center">
      <h1>Room: {roomId}</h1>
        <div>
            {allUser.map(people => {
                return (
                    <div>
                        {people}
                    </div>
                )
            })}
        </div>
    </div>
        </div>
    )
}
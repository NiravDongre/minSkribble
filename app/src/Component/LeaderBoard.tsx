import { useEffect, useState } from "react";

interface Board {
    Socket: WebSocket
}
 
export default function LeaderBoard({Socket} : Board){

    const [ allUser, setAllUser ] = useState([]);

    useEffect(() => {

    const handleUser = (messages) => {
        const data = JSON.parse(messages.data);
    }
    Socket.addEventListener("message", handleUser)
    }, [Socket])


    return (
        <div>

        </div>
    )
}
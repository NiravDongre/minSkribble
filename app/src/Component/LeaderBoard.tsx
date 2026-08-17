import { memo, useEffect, useState } from "react";

interface Board {
    Socket: WebSocket,
    roomId: string
}
 
const LeaderBoard = ({Socket, roomId} : Board) => {

    const [ allUser, setAllUser ] = useState([]);

    useEffect(() => {

    const handleUser = (messages) => {
        const data = JSON.parse(messages.data);
        if(data.type === "add-type"){
            setAllUser(prev =>  [...prev, data.username])
        }
    }
    Socket.addEventListener("message", handleUser)

    return () => {
        Socket.removeEventListener("message", handleUser);
    };
    }, [Socket])


return (
<div className="bg-yellow-500">
    <div className="text-sm text-gray-500 text-center">
      <h1>Room: {roomId}</h1>
        <div>
            <div>
                Players
                </div>
            {allUser.map(people => {
                return (
                    <div className="flex justify-between">
                        <div className="rounded-full flex items-center">
                            {people[0]}
                        </div>
                        <div className="font-bold">
                            {people}
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
</div>
    )
}

export default memo(LeaderBoard)
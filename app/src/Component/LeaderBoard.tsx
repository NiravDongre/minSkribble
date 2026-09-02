import { memo, useEffect, useState } from "react";

interface Board {
    Socket: WebSocket,
    roomId: string
}

interface Player {
    username: string;
    points: number;
    id: string;
}
 
const LeaderBoard = ({Socket, roomId} : Board) => {

    const [ allUser, setAllUser ] = useState<Player[]>([]);

    useEffect(() => {

    const handleUser = (messages: MessageEvent) => {
        const data = JSON.parse(messages.data);
        if(data.type === "add-type"){
            setAllUser(prev =>  [...prev,{ username: data.username, points: data.points, id: data.id }])
        }
        if(data.type === "pointplus"){
        setAllUser(prev =>
                prev.map(player =>
                    player.username === data.username
                        ? { ...player, points: data.points , id: data.id }
                        : player
                )
            );
        }

    }
    Socket.addEventListener("message", handleUser)

    return () => {
        Socket.removeEventListener("message", handleUser);
    };
    }, [Socket])

return (
        <div className="w-full rounded-xl m-10 bg-white p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between border-b pb-3">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">
                        Players
                    </h2>
                    <p className="text-xs text-gray-500">
                        Room: {roomId}
                    </p>
                </div>

                <div className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600">
                    {allUser.length}
                </div>
            </div>

            <div className="space-y-2">
                {allUser.map((people) => (
                    <div
                        key={people.id}
                        className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 transition hover:bg-gray-100"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 font-bold text-white">
                                {people.username[0]?.toUpperCase()}
                            </div>

                            <span className="font-medium text-gray-800">
                                {people.username}
                            </span>
                        </div>

                        <span className="font-bold text-gray-700">
                            {people.points}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default memo(LeaderBoard)
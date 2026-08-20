
interface Leave {
    Socket: WebSocket,
    roomId: string
}

const LeaveGame = ({Socket, roomId}: Leave) => {
        const handler = () => {
        const LeaveRoom = {
            type: "leave-room",
            roomId: roomId
        }

        Socket.send(JSON.stringify(LeaveRoom))
    }
    
    return <div>
        <button onClick={handler} className="flex cursor-pointer hover:text-white justify-between p-4 bg-blue-400 border-black rounded-b-lg">
            Leave-room
        </button>
    </div>
}

export default LeaveGame
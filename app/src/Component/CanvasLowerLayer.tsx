
interface MoreButton {
    Socket: WebSocket,
    roomId: string
}

const CanavsBottom = ({Socket, roomId} : MoreButton) => {

    const handler = () => {
        const CanvasErase = {
            type: "erase-canvas",
            roomId: roomId
        }

        Socket.send(JSON.stringify(CanvasErase))
    }



    return (
        <div>
            <div className="flex justify-between p-4 bg-blue-400 border-black rounded-b-lg">
                <button onClick={handler} className="p-2 border-black cursor-pointer bg-black font-semibold rounded text-white border-black">
                    Erase
                </button>
            </div>
        </div>
    )
}


export default CanavsBottom
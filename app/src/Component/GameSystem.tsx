import { SetStateAction, useEffect } from "react";

interface Setting {
    Socket: WebSocket,
    roomId: string,
    round: number,
    setTimeleft: React.Dispatch<SetStateAction<number>>,
    setStartPlay: React.Dispatch<SetStateAction<boolean>>,
    timeleft: number,
    startPlay: boolean
}

const Setting = (
            {Socket, 
                roomId,
                round, 
                setTimeleft, 
                timeleft,
                setStartPlay,
                startPlay
            }: Setting) => {


    function handler (){
        setStartPlay(true)
    }

    useEffect(() => {

    const payload = {
        type: "start-play",
        roomId: roomId
    }

    if(startPlay === true){
        Socket.send(JSON.stringify(payload))   
    }

    const handleFunction = (messages) => {
        const response = JSON.parse(messages.data);
        
        if(response.type === "time"){
            setTimeleft(response.Timeleft)
        }
        if(response.type === "need-player"){
            setStartPlay(false)
            alert(response.message)
        }
        if(response.type === "already-started"){
            alert(response.message)
        }
    }

    Socket.addEventListener("message", handleFunction)

    return (() => {
        Socket.removeEventListener("message", handleFunction)
    })

}, [Socket,startPlay])

    return (
        <div className="flex justify-between p-4 bg-blue-400 border-black rounded-t-lg">
            <div className="p-2 font-bold text-md">
                TimeLeft: {timeleft}
            </div>

            <div>
                Round: {round}
            </div>

            <div>
                <button className="p-2 border-black cursor-pointer bg-black font-semibold rounded text-white border-black"
                onClick={handler}
                >
                    Start
                </button>
            </div>
        </div>
    )
}

export default Setting;
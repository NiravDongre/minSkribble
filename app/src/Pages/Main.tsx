import { useEffect, useState } from "react"
import Canvas from "../Component/Canvas"
import Chat from "../Component/Chat";
import LeaderBoard from "../Component/LeaderBoard";
import { useLocation } from "react-router-dom";
import Setting from "../Component/GameSystem";
import CanavsBottom from "../Component/CanvasLowerLayer";
import LeaveGame from "../Component/LeaveGame";
const something = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);
import { useNavigate } from "react-router-dom";
interface Message {
    sender: string;
    text: string;
}

export default function Main(){
  const navigate = useNavigate();
  const location = useLocation();
  const [ messages , setMessages] = useState<Message[]>([]);
  const [ Socket, setSocket ] = useState<WebSocket | null>(null);
  const [ word, setWord ] = useState("");4
  const [ isDrawer, setIsDrawer ] = useState(false);
  const { username, roomId } = location.state || { username: "", roomId: "" }
  const [ round, setRound ] = useState(1);
  const [ timeleft, setTimeleft ] = useState(80);
  const [ startPlay, setStartPlay ] = useState(false);
  const [ isHost, setIsHost ] = useState(false);

  useEffect(() => {

    if(!something) return;

    something.onmessage = (message) => {
      const response = JSON.parse(message.data);


      if(response.type === "host-is"){
        setIsHost(response.isHost)
      }

      if(response.type === "player-role"){
          setStartPlay(false)
          setIsDrawer(response.isDrawer);
          setRound(response.round)
          if(response.isDrawer){
              setWord(response.word);
          }
      }

      if(response.type === "actual-word"){
        alert(`The word was ${response.word}`)
      }

      if(response.type === "Game-Over"){
        alert(response.message);
        navigate("/")
      }

      if(response.type === "leave-room"){
        navigate("/")
      }

      if(response.type === "player-left"){
        alert(`${response.username} has left`)
      }

      if(response.type === "new-Drawer"){
        setIsDrawer(response.isDrawer);
        setTimeleft(response.time)
        if(response.isDrawer){
          alert(`${response.Drawer} is drawing`)
          setWord(response.word)
        } else{
          setWord("")
        }
        
      }

      if(response.type === "chat-room"){
        const messages = response.messages;
        const user = response.username;

        setMessages(prev => [...prev,{ sender: user, text:messages}])
      }
    }

    setSocket(something);

      if(something.readyState === WebSocket.OPEN) {
      const payload = {
        type: "join-room",
        roomId: roomId,
        username: username
      };
      something.send(JSON.stringify(payload));
    } else {
      something.onopen = () => {
        const payload = {
          type: "join-room",
          roomId: roomId,
          username: username
        };
        something.send(JSON.stringify(payload));
      };
    }

    return () => {
    something.onmessage = null;  
  }

  }, [setMessages])

    if(Socket == null){
      return <div className="h-screen flex justify-center items-center">
        ...Loading
      </div>
    }

  return (
 <div className="h-screen">

<div className="bg-red-600 text-2xl text-center">
      Guess the word : {word}
    </div>
 <div className="bg-yellow-500 flex justify-between items-center">

<LeaderBoard Socket={Socket} roomId={roomId}/>

<div>

 {isHost || isDrawer ? <Setting Socket={Socket} 
          setTimeleft={setTimeleft} 
          timeleft={timeleft} 
          round={round} 
          setStartPlay={setStartPlay} 
          startPlay={startPlay} 
          roomId={roomId}
  /> : <div></div>}
    {Socket ? (
        <Canvas Socket={Socket} username={username} roomId={roomId} isDrawer={isDrawer} />
    ) : (
        <div>Connecting to whiteboard server...</div>
    )}

{ isDrawer ? <CanavsBottom Socket={Socket} roomId={roomId}/> : <div></div>}

<LeaveGame Socket={Socket} roomId={roomId} ></LeaveGame>
</div>

      <div className="h-full p-10 flex justify-center items-center">

      <div className="bg-blue-400 rounded-xl h-[738px] w-[400px] flex flex-col justify-between p-4">
        
        {/* 1. Scrollable message logs area at the top */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2 mb-4">
           {messages.length === 0 ? (
            <div className="text-sm text-center my-auto opacity-60 italic">Send a message to start guessing...</div>
          ) : (
            // 4. FIX: Use lowercase messages state array here
            messages.map((msg, index) => (
              <div key={index} className="p-3 rounded-xl bg-blue-300 text-slate-900 font-medium self-start max-w-[90%] shadow-sm">
                <strong>{msg.sender}:</strong> {msg.text}
              </div>
            ))
          )}
        </div>

        {/* 2. Interactive user inputs bar at the absolute bottom */}
        <div className="text-white">
          <Chat Socket={Socket} roomId={roomId} username={username}/>
        </div>

      </div>

      </div>

     </div>
    </div>
  )
}
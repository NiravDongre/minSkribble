import { useState } from "react";


export default function LeaderBoard({Socket}){

    const [ Alluser, setAlluser ] = useState([]);

    Socket.onmessage = (alluser) => {
        const response = JSON.parse(alluser.data);

        setAlluser(prev => [...prev, response])
        
    }

    return (
        <div>

        </div>
    )
}
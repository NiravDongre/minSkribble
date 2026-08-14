import React, { memo, useEffect, useRef, useState } from "react";

const Canvas = ({Socket, username}) => {
    const CanvasRef = useRef<HTMLCanvasElement | null>(null);
    const ContextRef = useRef(null);
    const [ drawing, setDrawing ] = useState(false)

useEffect(() => { 
    const canvas = CanvasRef.current;
    canvas.height = 1000; 
    canvas.width = 1000;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = "round"; 
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000'; 
    ContextRef.current = ctx;

    Socket.onmessage = (message) => {
    const response = JSON.parse(message.data);
    const ctx = ContextRef.current;

        if(response.type === "Startdraw"){
            ctx.moveTo(response.x, response.y)
            ctx.beginPath();
        }else if(response.type === "draw"){ 
            ctx.lineTo(response.x, response.y) 
            ctx.stroke(); 
        }else if(response.type === "Stopdraw" || response.type === "LeaveDraw"){
            ctx.closePath()
        }
    }     

}, [Socket]);


    const startdraw = (e: React.MouseEvent) => {
            const { offsetX, offsetY } = e.nativeEvent; 
            ContextRef.current.beginPath(); 
            ContextRef.current.moveTo(offsetX, offsetY) 
            ContextRef.current.lineTo(offsetX, offsetY) 
            ContextRef.current.stroke() 
            setDrawing(true) 

            const StartDrawPayload = {
                type: "StartDraw",
                username: username,
                roomId: "1234",
                x: offsetX,
                y: offsetY
            }
            Socket.send(JSON.stringify(StartDrawPayload));

            e.preventDefault()
    }

    const movedraw = (e : React.MouseEvent) => {
        if(!drawing) return; 
            const { offsetX, offsetY } = e.nativeEvent; 
            ContextRef.current.lineTo(offsetX, offsetY) 
            const DrawingPayload = { 
                type: "draw", 
                username: username, 
                roomId: "1234", 
                x: offsetX, 
                y: offsetY 
            } 
    Socket.send(JSON.stringify(DrawingPayload))
        ContextRef.current.stroke()
        e.preventDefault() 
    } 
    
    const stoptdraw = () => { 
        ContextRef.current.closePath();
        setDrawing(false) 
        const StopDrawPayload = {
                type: "StopDraw",
                username: username,
                roomId: "1234"
        }
        Socket.send(JSON.stringify(StopDrawPayload));
    }     
    const leavedraw = () => {  
        setDrawing(false) 
    
        const LeaveDrawPayload = {
                type: "LeaveDraw",
                username: username,
                roomId: "1234"
        }

        Socket.send(JSON.stringify(LeaveDrawPayload));
    } 

return (
    <canvas ref={CanvasRef}
    onMouseDown={startdraw} 
    onMouseMove={movedraw} 
    onMouseUp={stoptdraw} 
    onMouseLeave={leavedraw} 
    className="canvas-container"></canvas> 
                    
)}

export default memo(Canvas)
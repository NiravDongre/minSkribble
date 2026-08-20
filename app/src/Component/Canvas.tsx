import React, { memo, useEffect, useRef, useState } from "react";

interface Canvas {
    Socket: WebSocket,
    username: string,
    roomId: string,
    isDrawer: boolean
}

const Canvas = ({Socket, username, roomId, isDrawer}: Canvas) => {
    const CanvasRef = useRef<HTMLCanvasElement | null>(null);
    const ContextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [ drawing, setDrawing ] = useState(false)

useEffect(() => { 
    const canvas = CanvasRef.current;
    canvas.height = 600; 
    canvas.width = 900;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = "round"; 
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000'; 
    ContextRef.current = ctx;

    const handleFunction = (message: MessageEvent) => {
        const response = JSON.parse(message.data);
        const ctx = ContextRef.current;
            if(response.type === "clear-canvas"){
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            if(response.type === "StartDraw"){
                ctx.moveTo(response.x, response.y)
                ctx.beginPath();
            }else if(response.type === "draw"){ 
                ctx.lineTo(response.x, response.y) 
                ctx.stroke(); 
            }else if(response.type === "StopDraw" || response.type === "LeaveDraw"){
                ctx.closePath()
            } 
    }

    Socket.addEventListener("message", handleFunction)     

    return () => {
        Socket.removeEventListener("message", handleFunction);
    };
    
}, [Socket]);


    const startdraw = (e: React.MouseEvent) => {
        if (!isDrawer) return;
            const { offsetX, offsetY } = e.nativeEvent; 
            ContextRef.current.beginPath(); 
            ContextRef.current.moveTo(offsetX, offsetY) 
            ContextRef.current.lineTo(offsetX, offsetY) 
            ContextRef.current.stroke() 
            setDrawing(true) 

            const StartDrawPayload = {
                type: "StartDraw",
                username: username,
                roomId: roomId,
                x: offsetX,
                y: offsetY
            }
            Socket.send(JSON.stringify(StartDrawPayload));

            e.preventDefault()
    }

    const movedraw = (e : React.MouseEvent) => {
        if (!isDrawer) return;
        if(!drawing) return; 
            const { offsetX, offsetY } = e.nativeEvent; 
            ContextRef.current.lineTo(offsetX, offsetY);

        const DrawingPayload = { 
            type: "draw", 
            username: username, 
            roomId: roomId, 
            x: offsetX, 
            y: offsetY 
        
        } 
    Socket.send(JSON.stringify(DrawingPayload))
        ContextRef.current.stroke()
        e.preventDefault() 
    } 
    
    const stoptdraw = () => { 
        if (!isDrawer) return;
        ContextRef.current.closePath();
        setDrawing(false) 
        const StopDrawPayload = {
                type: "StopDraw",
                username: username,
                roomId: roomId
        }
        Socket.send(JSON.stringify(StopDrawPayload));
    }     
    const leavedraw = () => {
        if (!isDrawer) return;
        if(!drawing){
            setDrawing(false)
        }  
        const LeaveDrawPayload = {
                type: "LeaveDraw",
                username: username,
                roomId: roomId
        }

        Socket.send(JSON.stringify(LeaveDrawPayload));
    } 

return (
    <canvas ref={CanvasRef}
    onMouseDown={startdraw} 
    onMouseMove={movedraw} 
    onMouseUp={stoptdraw} 
    onMouseLeave={leavedraw} 
    className="canvas-container bg-white"></canvas> 
                    
)}

export default memo(Canvas)
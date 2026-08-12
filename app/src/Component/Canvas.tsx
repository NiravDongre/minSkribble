import React, { memo, useEffect, useRef, useState } from "react";

const Canvas = ({Socket, clientId}) => {
    const CanvasRef = useRef<HTMLCanvasElement | null>(null);
    const ContextRef = useRef(null);
    const [ drawing, setDrawing ] = useState(false)

    useEffect(() => { 
    const canvas = CanvasRef.current;
    
    canvas.height = 1000; canvas.width = 1000;
    
    const ctx = canvas.getContext('2d');

     Socket.onmessage = (message) => {
    const response = JSON.parse(message.data);
    
    if(response.type === "draw"){ ContextRef.current.lineTo(response.x, response.y) } } 
    
    ctx.lineCap = "round"; ctx.lineWidth = 1;
    ctx.strokeStyle = '#000'; ContextRef.current = ctx }, []);


    const startdraw = (e: React.MouseEvent) => {
            const { offsetX, offsetY } = e.nativeEvent; 
            ContextRef.current.beginPath(); 
            ContextRef.current.moveTo(offsetX, offsetY) 
            ContextRef.current.lineTo(offsetX, offsetY) 
            ContextRef.current.stroke() 
            setDrawing(true) 
            e.preventDefault()
    }

    const movedraw = (e : React.MouseEvent) => {
        if(!drawing) return; 
            const { offsetX, offsetY } = e.nativeEvent; 
            ContextRef.current.lineTo(offsetX, offsetY) 
            const DrawingPayload = { 
                type: "draw", 
                clientId: clientId, 
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
        setDrawing(false) } 
        const leavedraw = () => { 
            setDrawing(false) 
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


const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

let drawkiya = false;
let x = 0;
let y = 0;


canvas.addEventListener("mousedown", (e) => {
    x = e.offsetX;
    y = e.offsetY;
    drawkiya = true;
})

canvas.addEventListener("mousemove", (e) => {
    if(drawkiya){
        drawline(ctx, x, y, e.offsetX, e.offsetY)
        x = e.offsetX
        y = e.offsetY;
    }
})

window.addEventListener("mouseup", (e) => {
    if(drawkiya){
        drawline(ctx, x, y, e.offsetX, e.offsetY)
        x = 0;
        y = 0;
        drawkiya = false
    }
})


function drawline(ctx, x1, y1, x2, y2){
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath()
}
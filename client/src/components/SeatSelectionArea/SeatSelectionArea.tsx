import React, {useRef, useEffect} from 'react'
import { io } from "socket.io-client";
const sold = '#D8D8D8';
const notSold = '#01DF3A';
const clicked = '#FA58F4'
const cancelled = '#000000';

// 다른 선택자가 선택한 색과 내가 선택한 애들은 다르게 보여야 한다.
function SeatSelectionArea() {
    let canvasRef: any = useRef();
    let canvas: any;
    let ctx:any;
    let data:any;

    const socket = io(`http://localhost:8080/A`, {
        transports: ["websocket"],
        upgrade: false,
    });

    socket.on("receiveData",(seats: any ) => {
        data = [...seats];
        console.log(data)
        draw();
    });

    const draw = () => {
        data.forEach(function (x:any) {
            if (x.status === 'clicked')  {
                ctx.fillStyle = clicked;
            }
            else
                ctx.fillStyle = x.color;
            ctx.fillRect(x.point.x, x.point.y, 10, 10);
        });
    }

    const clickEvent = (e:any) => {
        e.stopPropagation();
        data.forEach((seat:any) => {
          if (
            e.offsetX > seat.point.x &&
            e.offsetX < seat.point.x + 10 &&
            e.offsetY > seat.point.y &&
            e.offsetY < seat.point.y + 10
          ) {
            if (seat.status === 'unsold' ) {
              seat.status = 'clicked';
              seat.color = clicked;
              socket.emit("clickSeat", "A", seat.id, seat);
              return seat;
            }
          }
        });
        
        draw();
      };
    
    useEffect(() => {
        socket.emit("joinRoom", "A");
        canvas = canvasRef.current;
        ctx = canvas.getContext("2d");

        canvas.addEventListener('click', clickEvent);
    }, [])

    return (
        <>
            <canvas ref={canvasRef} />
        </>

    )
}

export default SeatSelectionArea

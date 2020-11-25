import { styled } from "@material-ui/core/styles";
import { Toolbar } from "@material-ui/core";
import React, {useRef, useEffect} from 'react'
import { io } from "socket.io-client";
const sold = '#D8D8D8';
const unsold = '#01DF3A';
const clicked = '#FA58F4'
const cancelled = '#000000';
const myClicked = '#6495ED';

const Box = styled(Toolbar)({
  minHeight: "22rem",
  justifyContent: "flex-start",
  padding: "0 1rem",
});

export default function SeatSelectionArea() {
  let canvasRef: any = useRef();
  let canvas: any;
  let ctx:any;
  let data:any;
  let mySeat:Array<String> = [];

  const socket = io(`http://localhost:8080/A`, {
      transports: ["websocket"],
      upgrade: false,
  });

  socket.on("receiveData",(seats: any ) => {
      data = [...seats];
      if (mySeat) {
        data = data.map((seat:any) => {
            for (let i = 0; i < mySeat.length; i++) {
                if (mySeat[i] === seat.id)  {
                    seat.color = myClicked;
                    return seat;
                }
            }
            return seat;
        })
    }
    draw();
  });

  const draw = () => {
      data.forEach(function (x:any) {
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
            mySeat = [...mySeat, seat.id];
            socket.emit("clickSeat", "A", seat.id, seat);
            return seat;
          }
          else if (seat.status === 'clicked' && mySeat && mySeat.some((mySeatId: any) => mySeatId === seat.id)) {
            seat.status = 'unsold';
            seat.color = unsold;
            mySeat = mySeat.filter((mySeatId: any)=> mySeatId !== seat.id);
            socket.emit("clickSeat", "A", seat.id, seat);
            return seat;
          }
        }
      });
    };
  
  useEffect(() => {
      canvas = canvasRef.current;
      canvas.style.width = '414';
      canvas.style.height = '749';
      ctx = canvas.getContext("2d");
      socket.emit("joinRoom", "A");
      canvas.addEventListener('click', clickEvent);
  }, [])

  return (
    <>
      <Box><canvas ref={canvasRef} /></Box>
    </>
  );
}

import {useContext} from "react";
import { styled } from "@material-ui/core/styles";
import { Toolbar } from "@material-ui/core";
import React, {useRef, useEffect} from 'react'
import {SeatContext} from "../../../stores/SeatStore";
import useSelectSeat from '../../../hooks/useSelectSeat';
import useCancelSeat from '../../../hooks/useCancelSeat';
import useSeats from '../../../hooks/useSeats';
import {socket} from "../../../socket"


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

let mySeat:Array<String> = [];
let data:any;

export default function SeatSelectionArea() {
  let canvasRef: any = useRef();
  let canvas: any;
  let ctx:any;
  const {serverSeats} = useContext(SeatContext);
  const seats = useSeats().selectedSeat;
  const selectSeat = useSelectSeat();
  const cancelSeat = useCancelSeat();

  const draw = () => {
      if (mySeat.length) {
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
            selectSeat(seat);
            socket.emit("clickSeat", "A", seat.id, seat);
            return seat;
          }
          else if (seat.status === 'clicked' && mySeat && mySeat.some((mySeatId: any) => mySeatId === seat.id)) {
            seat.status = 'unsold';
            seat.color = unsold;
            cancelSeat(seat.id);
            socket.emit("clickSeat", "A", seat.id, seat);
            return seat;
          }
        }
      });
    };
  
  useEffect(() => {
    canvas = canvasRef.current;
    ctx = canvas.getContext("2d");
    canvas.addEventListener('click', clickEvent);
    socket.emit("joinRoom", "A");
  }, [])

  useEffect(()=> {
  if (seats.length) mySeat = seats.map((seat)=>`${seat.id}`);
  else mySeat = [];
  }, [seats]);

  useEffect(()=> {
    if (!ctx) {
      canvas = canvasRef.current;
      ctx = canvas.getContext("2d");
    }

    data = [...serverSeats];
    draw();
  }, [serverSeats])

  return (
    <>
      <Box><canvas ref={canvasRef} /></Box>
    </>
  );
}

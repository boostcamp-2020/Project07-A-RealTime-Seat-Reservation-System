import { useContext } from "react";
import { styled } from "@material-ui/core/styles";
import { Toolbar, Button } from "@material-ui/core";
import React, { useRef, useEffect } from "react";
import { SeatContext } from "../../../stores/SeatStore";
import useSelectSeat from "../../../hooks/useSelectSeat";
import useCancelSeat from "../../../hooks/useCancelSeat";
import useSeats from "../../../hooks/useSeats";
import { socket } from "../../../socket";
import { SEAT_STATUS } from "../../../constants/seatStatus";
import { SEAT_COLOR } from "../../../styles/seatColor";
import { SeatInfo } from "../../../types/seatInfo";
import { classicNameResolver } from 'typescript';

const Box = styled(Toolbar)({
  minHeight: "22rem",
  justifyContent: "flex-start",
  padding: "0 1rem",
});

let componentSelectedSeats: { [index: string]: SeatInfo } = {};
let componentSeats: SeatInfo[] = [];
let scale: number = 1;
let xDiff: number = 0;
let yDiff: number = 0;
let isDragged: boolean = false;
let xOffset: number = 0;
let yOffset: number = 0;

export default function SeatSelectionArea() {
  const canvasRef: any = useRef(null);
  const ctx: any = useRef(null);
  const { serverSeats } = useContext(SeatContext);
  const seats = useSeats().selectedSeat;
  const selectSeat = useSelectSeat();
  const cancelSeat = useCancelSeat();

  const draw = () => {
    const canvas = canvasRef.current;
    ctx.current.clearRect(0, 0, canvas.width, canvas.height);

    componentSeats = componentSeats.map((seat: SeatInfo) => {
      if (componentSelectedSeats[seat.id]) seat.color = SEAT_COLOR.MYSEAT;
      return seat;
    });

    componentSeats.forEach((seat: SeatInfo) => {
      ctx.current.fillStyle = seat.color;
      ctx.current.fillRect(seat.point.x - xOffset, seat.point.y - yOffset, 10, 10);
    });
  };

  const zoomIn = () => {
    ctx.current.scale(2, 2);
    scale *= 2;
    xOffset = 0;
    yOffset = 0;
    draw();
  };

  const zoomOut = () => {
    ctx.current.scale(0.5, 0.5);
    scale *= 0.5;
    xOffset = 0;
    yOffset = 0;
    draw();
  };

  const mouseDown = (e:any) => {
    e.stopPropagation();
    isDragged = false;
    xDiff = e.offsetX;
    yDiff = e.offsetY;
  };

  const dragging = (e:any) => {
    e.stopPropagation();
    isDragged = true;
    if (xDiff || yDiff) {
      xOffset = (xDiff - e.offsetX) / scale;
      yOffset = (yDiff - e.offsetY) / scale;
      draw();
    }
  };

  const mouseUp = (e:any) => {
    e.stopPropagation();
    xDiff = 0;
    yDiff = 0;
    if (isDragged) {
      componentSeats.forEach((seat: SeatInfo) => {
        seat.point.x -= xOffset;
        seat.point.y -= yOffset;
        return seat;
      });
    } else {
      componentSeats.forEach((seat: SeatInfo) => {
        if (
          e.offsetX > seat.point.x * scale &&
          e.offsetX < seat.point.x * scale + 10 * scale &&
          e.offsetY > seat.point.y * scale &&
          e.offsetY < seat.point.y * scale + 10 * scale
        ) {
          if (seat.status === SEAT_STATUS.UNSOLD) {
            selectSeat(seat);
            socket.emit("clickSeat", "A", seat.id);
            return seat;
          } else if (seat.status === SEAT_STATUS.CLICKED && componentSelectedSeats[seat.id]) {
            cancelSeat(seat.id);
            socket.emit("clickSeat", "A", seat.id);
            return seat;
          }
        }
      });
      xOffset = 0;
      yOffset = 0;
      draw();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    ctx.current = canvas.getContext("2d");
    canvas.style.width="100%";
    canvas.style.height="100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight
    canvas.addEventListener("mousedown", mouseDown);
    canvas.addEventListener("mouseup", mouseUp);
    canvas.addEventListener("mousemove", dragging);
    socket.emit("joinBookingRoom", "A");
    return () => {
      socket.emit("leaveBookingRoom", "A");
    };
  }, []);

  useEffect(() => {
    if (seats.length)
      componentSelectedSeats = seats.reduce((map: { [index: string]: SeatInfo }, seat) => {
        map[seat.id] = seat;
        return map;
      }, {});
    else componentSelectedSeats = {};
  }, [seats]);

  useEffect(() => {
    if (componentSeats.length) {
      const serverData = serverSeats.seats.reduce((map: { [index: string]: SeatInfo }, seat: SeatInfo) => {
        map[seat.id] = seat;
        return map;
      }, {});
      componentSeats = componentSeats.map((seat: SeatInfo) => {
        if (serverData[seat.id]) {
          seat.status = serverData[seat.id].status;
          seat.color = serverData[seat.id].color;
        }
        return seat;
      });
    } else {
      componentSeats = [...serverSeats.seats];
    }
    draw();
  }, [serverSeats.seats]);

  return (
    <>
      <Button onClick={()=>zoomIn()}>+</Button>
      <Button onClick={()=>zoomOut()}>-</Button>
      <Box>
        <canvas ref={canvasRef} />
      </Box>
    </>
  );
}

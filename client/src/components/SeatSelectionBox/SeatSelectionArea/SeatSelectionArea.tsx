import { useContext } from "react";
import { styled } from "@material-ui/core/styles";
import { Toolbar, Button, Box } from "@material-ui/core";
import React, { useRef, useEffect } from "react";
import { SeatContext } from "../../../stores/SeatStore";
import useSelectSeat from "../../../hooks/useSelectSeat";
import useCancelSeat from "../../../hooks/useCancelSeat";
import useSeats from "../../../hooks/useSeats";
import { socket } from "../../../socket";
import { SEAT_STATUS } from "../../../constants/seatStatus";
import { SEAT_COLOR } from "../../../styles/seatColor";
import { SeatInfo } from "../../../types/seatInfo";
import useConcertInfo from "../../../hooks/useConcertInfo";
import { classicNameResolver } from "typescript";
const CanvasContainer = styled(Toolbar)({
  minHeight: "22rem",
  justifyContent: "flex-start",
  padding: "0 1rem",
});

const ZoomButton = styled(Button)({
  width: "45px",
  height: "45px",
  display: "block",
  backgroundColor: "#fff",
  border: "1px solid #8b8b8b",
  borderRadius: "0px",
});

const ButtonBox = styled(Box)({
  position: "absolute",
  top: "20px",
  right: "20px",
  zIndex:101
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
  const concertInfo = useConcertInfo();
  const draw = () => {
    const canvas = canvasRef.current;
    ctx.current.clearRect(0, 0, canvas.width / scale, canvas.height / scale);
    ctx.current.fillStyle = "white";
    ctx.current.fillRect(0,0,canvas.width / scale, canvas.height / scale);
    componentSeats = componentSeats.map((seat: SeatInfo) => {
      if (componentSelectedSeats[seat._id]) seat.color = SEAT_COLOR.MYSEAT;
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
  const mouseDown = (e: any) => {
    e.stopPropagation();
    isDragged = false;
    xDiff = e.offsetX;
    yDiff = e.offsetY;
  };
  const dragging = (e: any) => {
    e.stopPropagation();
    isDragged = true;
    if (xDiff || yDiff) {
      xOffset = (xDiff - e.offsetX) / scale;
      yOffset = (yDiff - e.offsetY) / scale;
      draw();
    }
  };
  const mouseUp = (e: any) => {
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
            socket.emit(
              "clickSeat",
              localStorage.getItem("userid"),
              concertInfo.scheduleId,
              seat._id,
            );
            return seat;
          } else if (seat.status === SEAT_STATUS.CLICKED && componentSelectedSeats[seat._id]) {
            cancelSeat(seat._id);
            socket.emit(
              "clickSeat",
              localStorage.getItem("userid"),
              concertInfo.scheduleId,
              seat._id,
            );
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
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    canvas.addEventListener("mousedown", mouseDown);
    canvas.addEventListener("mouseup", mouseUp);
    canvas.addEventListener("mousemove", dragging);
    socket.emit("joinBookingRoom", localStorage.getItem("userid"), concertInfo.scheduleId);
    return () => {
      socket.emit("leaveBookingRoom", concertInfo.scheduleId);
    };
  }, []);
  useEffect(() => {
    if (seats.length)
      componentSelectedSeats = seats.reduce((map: { [index: string]: SeatInfo }, seat) => {
        map[seat._id] = seat;
        return map;
      }, {});
    else componentSelectedSeats = {};
  }, [seats]);
  useEffect(() => {
    if (componentSeats.length) {
      const serverData = serverSeats.seats.reduce(
        (map: { [index: string]: SeatInfo }, seat: SeatInfo) => {
          map[seat._id] = seat;
          return map;
        },
        {},
      );
      componentSeats = componentSeats.map((seat: SeatInfo) => {
        if (serverData[seat._id]) {
          seat.status = serverData[seat._id].status;
          seat.color = serverData[seat._id].color;
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

      <CanvasContainer>
        <ButtonBox>
          <ZoomButton onClick={() => zoomIn()}>+</ZoomButton>
          <ZoomButton onClick={() => zoomOut()}>-</ZoomButton>
        </ButtonBox>
        <canvas ref={canvasRef} />   
      </CanvasContainer>
    </>
  );
}

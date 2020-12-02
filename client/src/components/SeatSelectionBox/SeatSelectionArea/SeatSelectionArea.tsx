import { useContext } from "react";
import { styled } from "@material-ui/core/styles";
import { Toolbar } from "@material-ui/core";
import React, { useRef, useEffect } from "react";
import { SeatContext } from "../../../stores/SeatStore";
import useSelectSeat from "../../../hooks/useSelectSeat";
import useCancelSeat from "../../../hooks/useCancelSeat";
import useSeats from "../../../hooks/useSeats";
import { socket } from "../../../socket";
import { SEAT_STATUS } from "../../../constants/seatStatus";
import { SEAT_COLOR } from "../../../styles/seatColor";
import { SeatInfo } from "../../../types/seatInfo";

const Box = styled(Toolbar)({
  minHeight: "22rem",
  justifyContent: "flex-start",
  padding: "0 1rem",
});

let componentSelectedSeats: { [index: string]: SeatInfo } = {};
let componentSeats: SeatInfo[] = [];

export default function SeatSelectionArea() {
  const canvasRef: any = useRef(null);
  const ctx: any = useRef(null);
  const { serverSeats } = useContext(SeatContext);
  const seats = useSeats().selectedSeat;
  const selectSeat = useSelectSeat();
  const cancelSeat = useCancelSeat();

  const draw = () => {
    componentSeats = componentSeats.map((seat: SeatInfo) => {
      if (componentSelectedSeats[seat.id]) seat.color = SEAT_COLOR.MYSEAT;
      return seat;
    });

    componentSeats.forEach((seat: SeatInfo) => {
      ctx.current.fillStyle = seat.color;
      ctx.current.fillRect(seat.point.x, seat.point.y, 10, 10);
    });
  };

  const clickEvent = (e: any) => {
    e.stopPropagation();
    componentSeats.forEach((seat: SeatInfo) => {
      if (
        e.offsetX > seat.point.x &&
        e.offsetX < seat.point.x + 10 &&
        e.offsetY > seat.point.y &&
        e.offsetY < seat.point.y + 10
      ) {
        if (seat.status === SEAT_STATUS.UNSOLD) {
          seat.status = SEAT_STATUS.CLICKED;
          seat.color = SEAT_COLOR.CLICKED;
          selectSeat(seat);
          socket.emit("clickSeat", "A", seat.id, seat);
          return seat;
        } else if (
          seat.status === SEAT_STATUS.CLICKED &&
          componentSelectedSeats[seat.id]
        ) {
          seat.status = SEAT_STATUS.UNSOLD;
          seat.color = SEAT_COLOR.UNSOLD;
          cancelSeat(seat.id);
          socket.emit("clickSeat", "A", seat.id, seat);
          return seat;
        }
      }
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    ctx.current = canvas.getContext("2d");
    canvas.addEventListener("click", clickEvent);
    socket.emit("joinRoom", "A");
  }, []);

  useEffect(() => {
    if (seats.length)
      componentSelectedSeats = seats.reduce(
        (map: { [index: string]: SeatInfo }, seat) => {
          map[seat.id] = seat;
          return map;
        },
        {}
      );
    else componentSelectedSeats = {};
  }, [seats]);

  useEffect(() => {
    componentSeats = [...serverSeats.seats];
    draw();
  }, [serverSeats.seats]);

  return (
    <>
      <Box>
        <canvas ref={canvasRef} />
      </Box>
    </>
  );
}

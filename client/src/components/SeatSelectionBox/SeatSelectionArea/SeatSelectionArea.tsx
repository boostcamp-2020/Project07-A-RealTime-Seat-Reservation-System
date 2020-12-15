import { useContext } from "react";
import { styled, makeStyles } from "@material-ui/core/styles";
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
import { useQuery, gql } from "@apollo/client";
import { Loading } from "../../common";

const GET_SEATS = gql`
  query seats($scheduleId: ID) {
    seats(scheduleId: $scheduleId) {
      _id
      name
      class
      color
      status
      point {
        x
        y
      }
    }
  }
`;

const useStyles = makeStyles(() => ({
  loading: {
    width: "100%",
    padding: "50px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

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
  zIndex: 101,
});

let componentSelectedSeats: { [index: string]: SeatInfo } = {};
let componentSeats: { [index: string]: SeatInfo } = {};

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
  const classes = useStyles();

  const { loading, error, data } = useQuery(GET_SEATS, {
    variables: { scheduleId: concertInfo.scheduleId },
  });

  const drawSeats = () => {
    const canvas = canvasRef.current;
    ctx.current.clearRect(0, 0, canvas.width / scale, canvas.height / scale);
    ctx.current.fillStyle = "white";
    ctx.current.fillRect(0, 0, canvas.width / scale, canvas.height / scale);

    Object.values(componentSeats).forEach((seat: SeatInfo) => {
      ctx.current.fillStyle = seat.color;
      ctx.current.fillRect(seat.point.x - xOffset, seat.point.y - yOffset, 10, 10);
    });
  };

  const drawRealTimeSeats = (seats: [SeatInfo]) => {
    seats.forEach((seat) => {
      if (componentSelectedSeats[seat._id] === undefined) {
        componentSeats[seat._id] = {
          ...componentSeats[seat._id],
          color: seat.color,
          status: seat.status,
        };
        ctx.current.fillStyle = componentSeats[seat._id].color;
        ctx.current.fillRect(
          componentSeats[seat._id].point.x - xOffset,
          componentSeats[seat._id].point.y - yOffset,
          10,
          10,
        );
      }
      if (componentSelectedSeats[seat._id]) {
        const newColor = seat.status === SEAT_STATUS.CLICKED ? SEAT_COLOR.MYSEAT : seat.color;
        componentSeats[seat._id] = {
          ...componentSeats[seat._id],
          color: newColor,
          status: seat.status,
        };

        ctx.current.fillStyle = componentSeats[seat._id].color;
        ctx.current.fillRect(
          componentSeats[seat._id].point.x - xOffset,
          componentSeats[seat._id].point.y - yOffset,
          10,
          10,
        );
      }
    });
  };

  const zoomIn = () => {
    ctx.current.scale(2, 2);
    scale *= 2;
    xOffset = 0;
    yOffset = 0;
    drawSeats();
  };

  const zoomOut = () => {
    ctx.current.scale(0.5, 0.5);
    scale *= 0.5;
    xOffset = 0;
    yOffset = 0;
    drawSeats();
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
      drawSeats();
    }
  };

  const mouseUp = (e: any) => {
    e.stopPropagation();
    xDiff = 0;
    yDiff = 0;
    if (isDragged) {
      Object.values(componentSeats).forEach((seat: SeatInfo) => {
        seat = {
          ...seat,
          point: { ...seat.point, x: seat.point.x - xOffset, y: seat.point.y - yOffset },
        };
        return seat;
      });

      xOffset = 0;
      yOffset = 0;
      drawSeats();
    } else {
      const arr = Object.values(componentSeats);
      const length = arr.length;
      let seat: SeatInfo;
      for (let i = 0; i < length; i += 1) {
        seat = arr[i];
        if (
          e.offsetX > seat.point.x * scale &&
          e.offsetX < seat.point.x * scale + 10 * scale &&
          e.offsetY > seat.point.y * scale &&
          e.offsetY < seat.point.y * scale + 10 * scale
        ) {
          if (seat.status === SEAT_STATUS.UNSOLD) {
            selectSeat(seat);
            socket.emit("clickSeat", localStorage.getItem("userid"), concertInfo.scheduleId, seat);
          } else if (seat.status === SEAT_STATUS.CLICKED && componentSelectedSeats[seat._id]) {
            cancelSeat(seat._id);
            socket.emit("clickSeat", localStorage.getItem("userid"), concertInfo.scheduleId, seat);
          }
          break;
        }
      }
    }
  };

  useEffect(() => {
    componentSelectedSeats = {};
    componentSeats = {};
    scale = 1;
    xDiff = 0;
    yDiff = 0;
    isDragged = false;
    xOffset = 0;
    yOffset = 0;
    const canvas = canvasRef.current;
    ctx.current = canvas.getContext("2d");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    canvas.addEventListener("mousedown", mouseDown);
    canvas.addEventListener("mouseup", mouseUp);
    //canvas.addEventListener("mousemove", dragging);
    socket.emit("joinBookingRoom", localStorage.getItem("userid"), concertInfo.scheduleId);
    return () => {
      socket.emit("leaveBookingRoom", concertInfo.scheduleId);
      componentSeats = {};
    };
  }, []);

  useEffect(() => {
    if (data) {
      componentSeats = data.seats.reduce((acc: any, val: any) => {
        return { ...acc, [val._id]: val };
      }, {});

      drawSeats();
    }
  }, [data]);

  useEffect(() => {
    if (seats.length)
      componentSelectedSeats = seats.reduce(
        (map: { [index: string]: SeatInfo }, seat: SeatInfo) => {
          map[seat._id] = seat;
          return map;
        },
        {},
      );
    else componentSelectedSeats = {};
  }, [seats]);

  useEffect(() => {
    drawRealTimeSeats(serverSeats.seats);
  }, [serverSeats.seats]);

  socket.on("expireSeat", (seatId: string) => {
    cancelSeat(seatId);
  });

  if (loading)
    return (
      <Box className={classes.loading}>
        <Loading />
      </Box>
    );
  if (error) return <>Error! ${error.message}</>;
  return (
    <>
      <CanvasContainer>
        <ButtonBox>
          {/* <ZoomButton onClick={() => zoomIn()}>+</ZoomButton> */}
          {/* <ZoomButton onClick={() => zoomOut()}>-</ZoomButton> */}
        </ButtonBox>
        <canvas ref={canvasRef} />
      </CanvasContainer>
    </>
  );
}

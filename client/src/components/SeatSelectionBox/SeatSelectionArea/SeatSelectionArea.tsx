import { styled, makeStyles } from "@material-ui/core/styles";
import { Toolbar, Button, Box } from "@material-ui/core";
import React, { useRef, useEffect, useContext } from "react";
import WebSharedWorker from "../../../worker/WebWorker";
import { SEAT_STATUS } from "../../../constants/seatStatus";
import { SEAT_COLOR } from "../../../styles/seatColor";
import { SeatInfo } from "../../../types/seatInfo";
import useConcertInfo from "../../../hooks/useConcertInfo";
import { useQuery, gql } from "@apollo/client";
import { SocketContext } from "../../../stores/SocketStore";
import { throttling } from "../../../lib/throttle";

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
let movedXOffset: number = 0;
let movedYOffset: number = 0;
let zoomCount: number = 0;

const totalAnimationFrame = 20;
const seatLength = 7;
const throttler = throttling();
const drawOffset = {
  x: 0,
  y: 0,
};
const seatsImage = new Image();
seatsImage.src = require("../../../images/seats.jpg").default;

export default function SeatSelectionArea() {
  const socketWorker = WebSharedWorker;
  const canvasRef: any = useRef(null);
  const ctx: any = useRef(null);
  const { socketData, selectSeat, cancelSeat, initRealTimeSeats, initSeats } = useContext(
    SocketContext,
  );

  const concertInfo = useConcertInfo();
  const classes = useStyles();

  const { loading, error, data, refetch } = useQuery(GET_SEATS, {
    variables: { scheduleId: concertInfo.scheduleId },
  });

  const drawSeats = () => {
    const canvas = canvasRef.current;

    ctx.current.clearRect(0, 0, canvas.width / scale, canvas.height / scale);
    ctx.current.drawImage(
      seatsImage,
      -drawOffset.x - movedXOffset,
      -drawOffset.y - movedYOffset,
      canvas.width,
      canvas.height,
    );

    Object.values(componentSeats).forEach((seat: SeatInfo) => {
      ctx.current.fillStyle = seat.color;
      ctx.current.fillRect(
        seat.point.x - drawOffset.x - movedXOffset,
        seat.point.y - drawOffset.y - movedYOffset,
        seatLength,
        seatLength,
      );
    });
  };

  const drawRealTimeSeats = (seats: any) => {
    seats.forEach((seat: any) => {
      if (!componentSeats[seat._id] || !componentSeats[seat._id].point) {
        return;
      }
      if (componentSelectedSeats[seat._id] === undefined) {
        componentSeats[seat._id] = {
          ...componentSeats[seat._id],
          color: seat.color,
          status: seat.status,
        };
        ctx.current.fillStyle = componentSeats[seat._id].color;
        ctx.current.fillRect(
          componentSeats[seat._id].point.x - movedXOffset - drawOffset.x,
          componentSeats[seat._id].point.y - movedYOffset - drawOffset.y,
          seatLength,
          seatLength,
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
          componentSeats[seat._id].point.x - movedXOffset - drawOffset.x,
          componentSeats[seat._id].point.y - movedYOffset - drawOffset.y,
          seatLength,
          seatLength,
        );
      }
    });
  };

  const zoomIn = () => {
    movedXOffset = 0;
    movedYOffset = 0;
    if (zoomCount >= 2) return;
    zoomCount++;

    let currentFrame: number = 0;
    let animationScale: number = 1;
    ctx.current.save();

    const zoomInAnimation = setInterval(function () {
      if (currentFrame <= totalAnimationFrame) {
        ctx.current.restore();
        ctx.current.save();
        scale *= animationScale;
        ctx.current.scale(animationScale, animationScale);
        drawSeats();
        scale /= animationScale;
        currentFrame++;
        animationScale += 0.05;
      } else {
        clearTimeout(zoomInAnimation);
        scale *= 2;
        return;
      }
    }, 5);
  };

  const zoomOut = () => {
    movedXOffset = 0;
    movedYOffset = 0;
    if (zoomCount <= 0) return;
    zoomCount--;

    let currentFrame: number = 0;
    let animationScale: number = 1;
    ctx.current.save();
    const tempX = drawOffset.x / totalAnimationFrame;
    const tempY = drawOffset.y / totalAnimationFrame;
    const zoomOutAnimation = setInterval(function () {
      if (currentFrame <= totalAnimationFrame) {
        ctx.current.restore();
        ctx.current.save();
        scale *= animationScale;
        ctx.current.scale(animationScale, animationScale);
        if (zoomCount === 0) {
          drawOffset.x -= tempX;
          drawOffset.y -= tempY;
        } 
        drawSeats();
        scale /= animationScale;
        currentFrame++;
        animationScale -= 0.025;
      } else {
        clearTimeout(zoomOutAnimation);
        scale *= 0.5;
        return;
      }
    }, 5);
  };

  const mouseDown = (e: any) => {
    e.stopPropagation();
    isDragged = false;
    xDiff = e.offsetX;
    yDiff = e.offsetY;
  };

  const dragging = (e: any) => {
    e.stopPropagation();
    const canvas = canvasRef.current;
    isDragged = true;
    let lastX = e.offsetX;
    let lastY = e.offsetY;

    if (e.target.id === "root") {
      lastX = e.pageX - canvas.offsetLeft;
      lastY = e.pageY - canvas.offsetTop;
    }

    if (xDiff || yDiff) {
      movedXOffset = (xDiff -lastX) / scale;
      movedYOffset = (yDiff - lastY) / scale;

      if (movedXOffset + drawOffset.x < 0) {
        movedXOffset = -drawOffset.x;
      }

      if (movedYOffset + drawOffset.y < 0) {
        movedYOffset = -drawOffset.y;
      }

      if (movedXOffset + drawOffset.x > canvas.width - canvas.width / scale) {
        movedXOffset = canvas.width - canvas.width / scale - drawOffset.x;
      }

      if (movedYOffset + drawOffset.y > canvas.height - canvas.height / scale) {
        movedYOffset = canvas.height - canvas.height / scale - drawOffset.y;
      }
      drawSeats();
    }
  };

  const mouseUp = (e: any) => {
    e.stopPropagation();
    xDiff = 0;
    yDiff = 0;
    if (isDragged) {
      drawOffset.x += movedXOffset;
      drawOffset.y += movedYOffset;
      movedXOffset = 0;
      movedYOffset = 0;
    } else {
      const arr = Object.values(componentSeats);
      const length = arr.length;
      let seat: SeatInfo;
      for (let i = 0; i < length; i += 1) {
        seat = arr[i];
        if (
          e.offsetX > (seat.point.x - drawOffset.x) * scale &&
          e.offsetX < (seat.point.x - drawOffset.x) * scale + seatLength * scale &&
          e.offsetY > (seat.point.y - drawOffset.y) * scale &&
          e.offsetY < (seat.point.y - drawOffset.y) * scale + seatLength * scale
        ) {
          if (seat.status === SEAT_STATUS.UNSOLD) {
            socketWorker.postMessage({
              type: "clickSeat",
              userId: localStorage.getItem("userid"),
              scheduleId: concertInfo.scheduleId,
              seat: seat,
              status: "unsold",
            });
          } else if (seat.status === SEAT_STATUS.CLICKED && componentSelectedSeats[seat._id]) {
            cancelSeat(seat._id);

            socketWorker.postMessage({
              type: "clickSeat",
              userId: localStorage.getItem("userid"),
              scheduleId: concertInfo.scheduleId,
              seat: seat,
              status: "clicked",
            });
          }
          break;
        }
      }
    }
  };

  useEffect(() => {
    initRealTimeSeats();
    initSeats();
    componentSelectedSeats = {};
    componentSeats = {};
    scale = 1;
    xDiff = 0;
    yDiff = 0;
    isDragged = false;
    movedXOffset = 0;
    movedYOffset = 0;
    drawOffset.x = 0;
    drawOffset.y = 0;
    zoomCount = 0;


    const canvas = canvasRef.current;
    ctx.current = canvas.getContext("2d");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    canvas.addEventListener("mousedown", mouseDown);
    canvas.addEventListener("mouseup", mouseUp);
    canvas.addEventListener("mousemove", dragging);
    return () => {
      socketWorker.postMessage({
        type: "leaveSelectionRoom",
        userId: localStorage.getItem("userid"),
        scheduleId: concertInfo.scheduleId,
      });
    };
  }, []);

  useEffect(() => {
    refetch();
    if (data) {
      componentSeats = data.seats.reduce((acc: any, val: any) => {
        return { ...acc, [val._id]: val };
      }, {});

      drawSeats();
      socketWorker.postMessage({
        type: "joinSelectionRoom",
        userId: localStorage.getItem("userid"),
        scheduleId: concertInfo.scheduleId,
      });
    }
  }, [data]);

  useEffect(() => {
    if (socketData.selectedSeats.length)
      componentSelectedSeats = socketData.selectedSeats.reduce(
        (map: { [index: string]: SeatInfo }, seat: SeatInfo) => {
          map[seat._id] = seat;
          return map;
        },
        {},
      );
    else componentSelectedSeats = {};
  }, [socketData.selectedSeats]);

  useEffect(() => {
    drawRealTimeSeats(socketData.realTimeSeats);
  }, [socketData.realTimeSeats]);

  return (
    <>
      <CanvasContainer>
        <ButtonBox>
          <ZoomButton onClick={() => throttler.throttle(zoomIn, 150)}>+</ZoomButton>
          <ZoomButton onClick={() => throttler.throttle(zoomOut, 150)}>-</ZoomButton>
        </ButtonBox>
        <canvas ref={canvasRef} />
      </CanvasContainer>
    </>
  );
}

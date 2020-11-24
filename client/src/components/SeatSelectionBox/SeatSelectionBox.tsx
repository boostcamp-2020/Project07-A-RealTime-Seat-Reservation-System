import React, { useEffect, useState } from "react";
import SeatSelectedHeader from "./SeatSelectionHeader/SeatSelectionHeader";
import SeatSelectedArea from "./SeatSelectionArea/SeatSelectionArea";
import SeatInfoArea from "./SeatInfoArea/SeatInfoArea";
import { io } from "socket.io-client";

interface seatInfo {
  color: string;
  name: string;
  count: number;
}
interface selectedInfo {
  color: string;
  info: string;
}
const tmpSeatInfo: Array<seatInfo> = [
  { color: "#6c5ce7", name: "VIP석", count: 2 },
  { color: "#74b9ff", name: "R석", count: 0 },
  { color: "#e17055", name: "S석", count: 5 },
];
const tmpSelectedInfo: Array<selectedInfo> = [
  { color: "#6c5ce7", info: "1층 9열 8번" },
];
// TODO: SeatSelectionBox의 props로 공연 회차 정보 받아오기. -> useContext사용 고려
export default function SeatSelectionBox() {
  const [selectedSeatCount, setSelectedSeatCount] = useState(0);
  useEffect(() => {
    const socket = io(`http://localhost:8080/A`, {
      transports: ["websocket"],
      upgrade: false,
    });
    console.log(socket.emit("joinRoom", "A"));
    socket.on("receiveData", (data: any) => {
      console.log(data);
    });
    return () => {
      // TODO: 페이지 이동시 emit
    };
  }, []);
  // TODO: SeatSelectHeader의 props로 공연 회차 정보 넘겨주기
  return (
    <>
      <SeatSelectedHeader dateInfo="2020. 11. 28. (토), 오후 03:00" />
      <SeatSelectedArea />
      <SeatInfoArea
        selectedSeatCount={selectedSeatCount}
        seatInfo={tmpSeatInfo}
        selectedSeat={tmpSelectedInfo}
      />
    </>
  );
}

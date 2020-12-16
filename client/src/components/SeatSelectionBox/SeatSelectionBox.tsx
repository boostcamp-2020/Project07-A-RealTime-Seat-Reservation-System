import React, { useEffect } from "react";
import SeatSelectedHeader from "./SeatSelectionHeader/SeatSelectionHeader";
import SeatSelectedArea from "./SeatSelectionArea/SeatSelectionArea";
import SeatInfoArea from "./SeatInfoArea/SeatInfoArea";
import useConcertInfo from "../../hooks/useConcertInfo";

// TODO: SeatSelectionBox의 props로 공연 회차 정보 받아오기. -> useContext사용 고려
export default function SeatSelectionBox() {
  const concertInfo = useConcertInfo();
  // const socket = useSocket();
  useEffect(() => {
    return () => {
      // TODO: 페이지 이동시 emit
    };
  }, []);
  // TODO: SeatSelectHeader의 props로 공연 회차 정보 넘겨주기 -> 공연 회차 정보도 redux 사용?
  return (
    <>
      <SeatSelectedHeader dateInfo={concertInfo.dateDetail} />
      <SeatSelectedArea />
      <SeatInfoArea />
    </>
  );
}

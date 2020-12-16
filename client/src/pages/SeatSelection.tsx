import React, { useEffect } from "react";
import { MainHeader, SeatSelectionBox } from "../components";
import useConcertInfo from "../hooks/useConcertInfo";
import { useHistory } from "react-router-dom";
import { SocketStore } from "../stores/SocketStore";

export default function SeatSelection() {
  const concertInfo = useConcertInfo();
  const history = useHistory();

  useEffect(() => {
    if (concertInfo.id === "") {
      alert("공연을 선택해주세요.");
      history.replace("/");
    } else if (!concertInfo.scheduleId) {
      alert("회차를 선택해주세요.");
      history.replace("/schedule/" + concertInfo.id);
    }
  }, []);
  return (
    <>
      <MainHeader title="좌석선택하기" />
      <SeatSelectionBox />
    </>
  );
}

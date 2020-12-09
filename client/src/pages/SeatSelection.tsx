import React, { useEffect } from "react";
import { MainHeader, SeatSelectionBox } from "../components";
import useConcertInfo from "../hooks/useConcertInfo";
import { useHistory } from "react-router-dom";

export default function SeatSelection() {
  const concertInfo = useConcertInfo();
  const history = useHistory();

  useEffect(() => {
    if (concertInfo.id === "") history.goBack();
  }, []);
  return (
    <>
      <MainHeader title="좌석선택하기" />
      <SeatSelectionBox />
    </>
  );
}

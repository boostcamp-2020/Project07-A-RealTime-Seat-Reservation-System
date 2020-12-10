import React, { useEffect } from "react";
import { MainHeader, PaymentSelectInfo } from "../components";
import { initSeat } from "../modules/seats";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import useSeats from "../hooks/useSeats";
import useConcertInfo from "../hooks/useConcertInfo";

export default function Payment() {
  const dispatch = useDispatch();
  const history = useHistory();
  const seats = useSeats().selectedSeat;
  const concertInfo = useConcertInfo();

  useEffect(() => {
    if (!localStorage.getItem("userid")) {
      alert("로그인이 필요합니다.");
      history.replace("/login");
    } else if (concertInfo.id === "") {
      alert("공연을 선택해주세요.");
      history.replace("/");
    }
    return () => {
      dispatch(initSeat());
    };
  }, []);
  return (
    <>
      <MainHeader title="결제하기" />
      <PaymentSelectInfo />
    </>
  );
}

import React, { useEffect } from "react";
import { MainHeader, PaymentSelectInfo } from "../components";
import { initSeat } from "../modules/seats";
import { useDispatch } from "react-redux";
import useSeats from "../hooks/useSeats";

export default function Payment() {
  const dispatch = useDispatch();
  const seats = useSeats();
  useEffect(() => {
    return () => {
      dispatch(initSeat());
      console.log(1, seats);
    };
  }, []);
  return (
    <>
      <MainHeader title="결제하기" />
      <PaymentSelectInfo />
    </>
  );
}

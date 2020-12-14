import React, { useEffect } from "react";
import { MainHeader, BookingCancelArea } from "../components";
import { useHistory, useLocation } from "react-router-dom";
import { StateType } from "../types/booking";
import { socket } from "../socket";

export default function BookingCancel() {
  const history = useHistory();
  const location = useLocation<StateType>();
  useEffect(() => {
    if (!location.state) {
      alert("취소할 공연을 선택해주세요.");
      history.replace("/mypage");
    } else console.log(location.state.booking);
    //socket.emit("willCancelBooking", booking.schedule._id, booking.seats);
  }, []);
  return (
    <>
      <MainHeader title="예매 취소" />
      <BookingCancelArea />
    </>
  );
}

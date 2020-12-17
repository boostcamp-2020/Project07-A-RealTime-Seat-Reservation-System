import React, { useEffect } from "react";
import { MainHeader, BookingCancelArea } from "../components";
import { useHistory, useLocation } from "react-router-dom";
import { StateType } from "../types/booking";
import WebSharedWorker from "../worker/WebWorker";

export default function BookingCancel() {
  const history = useHistory();
  const location = useLocation<StateType>();
  const socketWorker = WebSharedWorker;
  useEffect(() => {
    if (!location.state) {
      alert("취소할 공연을 선택해주세요.");
      history.replace("/mypage");
    } else {
      const { schedule, seats } = location.state.booking;
      socketWorker.postMessage({
        type: "willCancelBooking",
        userId: localStorage.getItem("userid"),
        scheduleId: schedule._id,
        seatArray: seats,
      });
    }
  }, []);
  return (
    <>
      <MainHeader title="예매 취소" />
      <BookingCancelArea />
    </>
  );
}

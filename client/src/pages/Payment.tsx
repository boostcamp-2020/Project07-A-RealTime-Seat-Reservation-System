import React, { useEffect } from "react";
import { MainHeader, PaymentSelectInfo } from "../components";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import useConcertInfo from "../hooks/useConcertInfo";

export default function Payment() {
  const dispatch = useDispatch();
  const history = useHistory();
  const concertInfo = useConcertInfo();

  useEffect(() => {
    if (!localStorage.getItem("userid")) {
      alert("로그인이 필요합니다.");
      history.replace("/login");
    } else if (concertInfo.id === "") {
      alert("공연을 선택해주세요.");
      history.replace("/");
    } else if (concertInfo.dateDetail === "") {
      alert("회차를 선택해주세요");
      history.replace("/schedule/" + concertInfo.id);
    }
    return () => {};
  }, []);
  return (
    <>
      <MainHeader title="결제하기" />
      <PaymentSelectInfo />
    </>
  );
}

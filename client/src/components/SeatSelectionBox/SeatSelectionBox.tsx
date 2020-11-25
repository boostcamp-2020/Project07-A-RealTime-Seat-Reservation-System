import React, { useEffect, useState, useRef } from "react";
import SeatSelectedHeader from "./SeatSelectionHeader/SeatSelectionHeader";
import SeatSelectedArea from "./SeatSelectionArea/SeatSelectionArea";
import SeatInfoArea from "./SeatInfoArea/SeatInfoArea";
import { useDispatch } from "react-redux";
import { create } from "../../modules/socket";
import useSocket from "../../hooks/useSocket";

// TODO: SeatSelectionBox의 props로 공연 회차 정보 받아오기. -> useContext사용 고려
export default function SeatSelectionBox() {
  const dispatch = useDispatch();
  const socket = useSocket();
  useEffect(() => {
    dispatch(create());
    /*
    TODO: socket.on에 대한 처리들
    ex)
    socket.on("receiveData", (data: any) => {
      console.log(data);
      // 이곳에서 redux의 상태 변화시켜주기
    });
    */
    return () => {
      // TODO: 페이지 이동시 emit
    };
  }, []);
  // TODO: SeatSelectHeader의 props로 공연 회차 정보 넘겨주기 -> 공연 회차 정보도 redux 사용?
  return (
    <>
      <SeatSelectedHeader dateInfo="2020. 11. 28. (토), 오후 03:00" />
      <SeatSelectedArea />
      <SeatInfoArea />
    </>
  );
}

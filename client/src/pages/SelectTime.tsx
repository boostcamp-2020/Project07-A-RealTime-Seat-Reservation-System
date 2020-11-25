import React from "react";
import { MainHeader } from "../components";
import useConcertInfo from "../hooks/useConcertInfo";

export default function SelectTime() {
  const concertInfo = useConcertInfo();
  return (
    <>
      <MainHeader title={concertInfo.title} />
    </>
  );
}

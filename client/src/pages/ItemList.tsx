import React, { useState, useEffect } from "react";
import { MainHeader } from "../components";
import ItemFilterArea from "../components/ItemFilterArea/ItemFilterArea";
import ItemCardArea from "../components/ItemCardArea/ItemCardArea";
import useSeats from "../hooks/useSeats";
import { useDispatch } from "react-redux";
import { initSeat } from "../modules/seats";

export default function ItemList() {
  const [genre, setGenre] = useState("전체");
  const dispatch = useDispatch();
  const seats = useSeats();
  useEffect(() => {
    dispatch(initSeat());
    console.log(seats);
  }, []);

  return (
    <>
      <MainHeader title="예매" />
      <ItemFilterArea genre={genre} setGenre={setGenre} />
      <ItemCardArea genre={genre} />
    </>
  );
}

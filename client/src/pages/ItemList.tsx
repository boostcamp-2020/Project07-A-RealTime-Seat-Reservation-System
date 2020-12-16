import React, { useState, useEffect } from "react";
import { MainHeader } from "../components";
import ItemFilterArea from "../components/ItemFilterArea/ItemFilterArea";
import ItemCardArea from "../components/ItemCardArea/ItemCardArea";
import { useDispatch } from "react-redux";

export default function ItemList() {
  const [genre, setGenre] = useState("전체");
  useEffect(() => {}, []);

  return (
    <>
      <MainHeader title="예매" />
      <ItemFilterArea genre={genre} setGenre={setGenre} />
      <ItemCardArea genre={genre} />
    </>
  );
}

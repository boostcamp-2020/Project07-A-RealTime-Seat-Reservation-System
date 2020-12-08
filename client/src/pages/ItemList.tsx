import React, { useState } from "react";
import { MainHeader } from "../components";
import ItemFilterArea from "../components/ItemFilterArea/ItemFilterArea";
import ItemCardArea from "../components/ItemCardArea/ItemCardArea";

export default function ItemList() {
  const [genre, setGenre] = useState("전체");

  return (
    <>
      <MainHeader title="예매" />
      <ItemFilterArea genre={genre} setGenre={setGenre} />
      <ItemCardArea genre={genre} />
    </>
  );
}

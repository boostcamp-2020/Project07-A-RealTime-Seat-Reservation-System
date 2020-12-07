import React from "react";
import { MainHeader } from "../components";
import ItemFilterArea from "../components/ItemFilterArea/ItemFilterArea";
import ItemCardArea from "../components/ItemCardArea/ItemCardArea";

export default function ItemList() {
  return (
    <>
      <MainHeader title="예매" />
      <ItemFilterArea />
      <ItemCardArea />
    </>
  );
}

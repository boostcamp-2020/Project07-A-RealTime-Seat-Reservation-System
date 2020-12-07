import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ItemFilter from "./ItemFilter";

const useStyles = makeStyles(() => ({
  root: {},

  tabList: {
    backgroundColor: "#FFFFFF",
  },
}));

function ItemFilterArea() {
  const mainFilterList = ["전체", "축구", "콘서트", "뮤지컬"];
  return (
    <>
      <ItemFilter filterList={mainFilterList}></ItemFilter>
    </>
  );
}

export default ItemFilterArea;

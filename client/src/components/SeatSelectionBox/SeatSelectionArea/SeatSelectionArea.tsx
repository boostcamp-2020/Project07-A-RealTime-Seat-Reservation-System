import { styled } from "@material-ui/core/styles";
import { Toolbar } from "@material-ui/core";
import React from "react";

const Box = styled(Toolbar)({
  minHeight: "22rem",
  justifyContent: "flex-start",
  padding: "0 1rem",
});
export default function SeatSelectionArea() {
  return (
    <>
      <Box></Box>
    </>
  );
}

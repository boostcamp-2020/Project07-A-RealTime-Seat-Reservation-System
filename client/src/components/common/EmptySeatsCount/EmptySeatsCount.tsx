import React from "react";
import { Box, List, ListItem } from "@material-ui/core";
import { makeStyles, styled } from "@material-ui/core/styles";
import { colors } from "../../../styles/variables";
import useSeats from "../../../hooks/useSeats";

interface styleProps {
  color: string;
}

const useStyles = makeStyles(() => ({
  info: {
    float: "left",
    overflowY: "auto",
    width: "100%",
    minHeight: "151px",
    maxHeight: "151px",
    padding: "8px 0 7px",
    boxSizing: "border-box",
    borderTop: `1px solid ${colors.borderGray}`,
  },
  item: {
    width: "100%",
    padding: "0",
    marginTop: "9px",
    fontSize: "1rem",
    lineHeight: "1.25rem",
  },
  title: {
    display: "flex",
    alignItems: "center",
    paddingLeft: "0",
    fontWeight: "bold",
  },
  seatCount: {
    color: "#666",
    paddingTop: "10px",
    textAlign: "right",
    whiteSpace: "nowrap",
    fontWeight: "normal",
  },
  price: {
    color: `${colors.naverFontBlack}`,
    fontWeight: "bold",
    textAlign: "right",
  },
  table: {
    width: "100%",
  },
}));

const Badge = styled(Box)((props: styleProps) => ({
  display: "inline-block",
  marginTop: "4px",
  width: "13px",
  height: "13px",
  top: "3px",
  marginRight: "0.5rem",
  backgroundColor: props.color,
}));

export default function EmptySeatsCount() {
  const classes = useStyles();
  const seats = useSeats();
  return (
    <>
      <Box className={classes.info}>
        <table className={classes.table}>
          {seats.seatCount.map((element, idx) => {
            return (
              <tr className={classes.item}>
                <td className={classes.title}>
                  <Badge component="span" color={element.color}></Badge>
                  <span>{element.name}</span>
                </td>
                <td className={classes.seatCount}>잔여 {element.count}석</td>
                <td className={classes.price}>{element.price}원</td>
              </tr>
            );
          })}
        </table>
      </Box>
    </>
  );
}

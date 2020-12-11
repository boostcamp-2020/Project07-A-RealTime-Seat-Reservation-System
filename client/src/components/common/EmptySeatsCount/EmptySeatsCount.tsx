import React, { useEffect, useContext, useState } from "react";
import { Box } from "@material-ui/core";
import { makeStyles, styled } from "@material-ui/core/styles";
import { colors } from "../../../styles/variables";
import { SeatContext } from "../../../stores/SeatStore";
import { EmptySeatCount } from "../../../types/seatInfo";
import { socket } from "../../../socket";
import useConcertInfo from "../../../hooks/useConcertInfo";

interface styleProps {
  color: string;
}

const useStyles = makeStyles(() => ({
  info: {
    float: "left",
    overflowY: "auto",
    width: "100%",
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
    paddingTop: "5px",
    paddingBottom: "5px",
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

export default function EmptySeatsCount({ color, price }: any) {
  const classes = useStyles();
  const [seatsCount, setSeatsCount] = useState<any>({});
  const { serverSeats } = useContext(SeatContext);
  const concertInfo = useConcertInfo();
  const intl = new Intl.NumberFormat("ko-KR");

  useEffect(() => {
    socket.emit("joinBookingRoom", localStorage.getItem("userid"), concertInfo.scheduleId);
    setSeatsCount({ ...serverSeats.counts });
    return () => {
      socket.emit("leaveBookingRoom", concertInfo.scheduleId);
    };
  }, []);

  useEffect(() => {
    setSeatsCount({ ...serverSeats.counts });
  }, [serverSeats.counts]);

  return (
    <>
      <Box className={classes.info}>
        <table className={classes.table}>
          <tbody>
            {Object.keys(seatsCount).map((element, idx) => {
              return (
                <tr key={idx} className={classes.item}>
                  <td className={classes.title}>
                    <Badge component="span" color={color[element]}></Badge>
                    <span>{element}</span>
                  </td>
                  <td className={classes.seatCount}>잔여 {seatsCount[element]}석</td>
                  <td className={classes.price}>{intl.format(price[element])}원</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
    </>
  );
}

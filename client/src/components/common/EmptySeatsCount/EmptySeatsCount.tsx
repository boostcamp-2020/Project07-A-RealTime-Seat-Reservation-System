import React, { useEffect, useContext, useState } from "react";
import { Box } from "@material-ui/core";
import { makeStyles, styled } from "@material-ui/core/styles";
import { colors } from "../../../styles/variables";
import useSeats from "../../../hooks/useSeats";
import { SeatContext } from "../../../stores/SeatStore";
import { EmptySeatCount } from "../../../types/seatInfo";
import { socket } from "../../../socket";
import { useQuery, gql } from "@apollo/client";

const GET_ITEMS = gql`
  query {
    itemDetail(itemId: "5fc7834bd703ca7366b38959") {
      prices {
        class
        price
      }
      classes {
        class
        color
      }
    }
  }
`;
interface styleProps {
  color: string;
}
interface SeatInfo {
  color: string;
  price: number;
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

export default function EmptySeatsCount() {
  const classes = useStyles();
  const [seatsCount, setSeatsCount] = useState<EmptySeatCount[]>([]);
  const { serverSeats } = useContext(SeatContext);
  let seatInfo: SeatInfo[] = [];
  // const [seatInfo, setSeatInfo] = useState<{ color: string; price: number }[]>(
  //   []
  // );

  const GET_ITEMS = gql`
    query {
      itemDetail(itemId: "5fc7834bd703ca7366b38959") {
        prices {
          class
          price
        }
        classes {
          class
          color
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_ITEMS);

  useEffect(() => {
    socket.emit("joinRoom", "A");
    setSeatsCount([...serverSeats.counts]);
  }, []);

  useEffect(() => {
    setSeatsCount([...serverSeats.counts]);
  }, [serverSeats.counts]);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  if (data) {
    seatInfo = data.itemDetail.classes.map((value: any, index: number) => {
      return {
        color: value.color,
        price: data.itemDetail.prices[index].price,
      };
    });
  }

  return (
    <>
      <Box className={classes.info}>
        <table className={classes.table}>
          <tbody>
            {seatsCount.map((element, idx) => {
              return (
                <tr key={idx} className={classes.item}>
                  <td className={classes.title}>
                    <Badge component="span" color={seatInfo[idx].color}></Badge>
                    <span>{element.class}</span>
                  </td>
                  <td className={classes.seatCount}>잔여 {element.count}석</td>
                  <td className={classes.price}>
                    {new Intl.NumberFormat("ko-KR").format(seatInfo[idx].price)}
                    원
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
    </>
  );
}

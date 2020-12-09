import React, { useEffect } from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { colors } from "../../styles/variables";
import { useQuery, gql } from "@apollo/client";
import { useHistory, Link } from "react-router-dom";
import useSeats from "../../hooks/useSeats";
import useConcertInfo from "../../hooks/useConcertInfo";
import { Badge, StepButton } from "../common";

const useStyles = makeStyles(() => ({
  selectInfo: {
    padding: "0 21px",
    backgroundColor: colors.naverWhite,
    borderBottom: `1px solid ${colors.borderLightGray}`,
  },
  title: {
    position: "relative",
    paddingBottom: "8px",
  },
  text: {
    display: "inline-block",
    paddingTop: "19px",
    fontSize: "21px",
    color: colors.naverFontBlack,
    letterSpacing: "-0.5px",
  },
  date: {
    padding: "2px 48px 0 0",
    color: colors.naverFontDarkGray,
    letterSpacing: "-0.3px",
  },
  changeBtn: {
    position: "absolute",
    bottom: "6px",
    right: "0",
    height: "28px",
    padding: "0 10px",
    backgroundColor: "#3794ff",
    borderRadius: "3px",
    color: colors.naverWhite,
    lineHeight: "28px",
    cursor: "pointer",
  },
  seatInfo: {
    padding: "6px 0 15px",
    borderTop: `1px solid ${colors.borderLightGray}`,
  },
  grade: {
    display: "table-row",
    tableLayout: "fixed",
  },
  gradeText: {
    display: "table-cell",
    padding: "4px 16px 0 0",
    fontWeight: "bold",
    fontSize: "16px",
  },
  seatText: {
    display: "table-cell",
    fontSize: "16px",
  },
  total: {
    marginTop: "14px",
    marginBottom: "20px",
    padding: "8px 8px 10px",
    background: "#f2f2f2",
    borderTop: "1px solid #e3e3e3",
  },
  price: {
    float: "right",
    textAlign: "right",
    fontSize: "18px",
    letterSpacing: "-0.3px",
    color: "#ff5658",
  },
}));

export default function PaymentSelectionBox() {
  const classes = useStyles();
  const concertInfo = useConcertInfo();
  const seats = useSeats();

  const history = useHistory();
  const GET_INFO = gql`
    query GetInfo($id: ID) {
      itemDetail(itemId: $id) {
        name
        prices {
          class
          price
        }
      }
    }
  `;
  const { loading, error, data } = useQuery(GET_INFO, {
    variables: { id: concertInfo.id },
  });

  const onClickChage = () => {
    history.replace(`/schedule/${concertInfo.id}`);
  };

  useEffect(() => {
    if (concertInfo.id === "") history.goBack();
  }, []);

  if (loading) return <p> loading.... </p>;
  if (error) return <>`Error! ${error.message}`</>;
  const { name, prices } = data.itemDetail;
  const price = prices.reduce((acc: any, value: any, idx: any, arr: any) => {
    acc[value.class] = value.price;
    return acc;
  }, {});

  const sum = seats.selectedSeat.reduce((acc, cur, i) => {
    return acc + price[cur.class];
  }, 0);

  return (
    <>
      <Box className={classes.selectInfo}>
        <Box className={classes.title}>
          <strong className={classes.text}>{name}</strong>
          <Box className={classes.date}>
            {concertInfo.dateDetail}, 총 {seats.selectedSeat.length}매
          </Box>
          <Box className={classes.changeBtn} onClick={onClickChage}>
            변경
          </Box>
        </Box>
        <Box className={classes.seatInfo}>
          {seats.selectedSeat.map((seat, idx) => {
            return (
              <Box key={idx} className={classes.grade}>
                <Box className={classes.gradeText}>
                  <Badge component="span" color={seat.color} />
                  <span>{seat.class}</span>
                </Box>
                <Box className={classes.seatText}>{seat.name}</Box>
              </Box>
            );
          })}
        </Box>
        <Box className={classes.total}>
          <span>합계</span>
          <strong className={classes.price}>{sum}</strong>
        </Box>
      </Box>
      <StepButton link="/" next="결제완료" />
    </>
  );
}

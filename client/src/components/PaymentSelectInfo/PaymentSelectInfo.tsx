import React from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { colors } from "../../styles/variables";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import useSeats from "../../hooks/useSeats";
import useConcertInfo from "../../hooks/useConcertInfo";
import { Badge, StepButton } from "../common";
import { Loading } from "../common";

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
    display: "table",
    tableLayout: "fixed",
    width: "100%",
  },
  gradeText: {
    display: "table-cell",
    padding: "4px 16px 0 0",
    fontWeight: "bold",
    fontSize: "16px",
  },
  seatText: {
    display: "table-cell",
    width: "40%",
    paddingRight: "16px",
    fontSize: "16px",
  },
  priceText: {
    display: "table-cell",
    padding: "4px 0 0",
    fontWeight: "bold",
    fontSize: "16px",
    float: "right",
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
  loading: {
    width: "100%",
    padding: "50px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function PaymentSelectionBox() {
  const classes = useStyles();
  const concertInfo = useConcertInfo();
  const seats = useSeats();
  const history = useHistory();
  const intl = new Intl.NumberFormat("ko-KR");
  const BOOK_ITEM = gql`
    mutation BookItem($userId: ID, $itemId: ID, $scheduleId: ID, $seats: [ID]) {
      bookItem(userId: $userId, itemId: $itemId, scheduleId: $scheduleId, seats: $seats) {
        _id
      }
    }
  `;
  const [bookItem] = useMutation(BOOK_ITEM);

  const GET_INFO = gql`
    query GetInfo($id: ID) {
      itemDetail(itemId: $id) {
        name
      }
    }
  `;
  const { loading, error, data } = useQuery(GET_INFO, {
    variables: { id: concertInfo.id },
  });

  const onClickChange = () => {
    history.replace(`/schedule/${concertInfo.id}`);
  };

  if (loading)
    return (
      <Box className={classes.loading}>
        <Loading />
      </Box>
    );
  if (error) return <>`Error! ${error.message}`</>;
  const { name } = data.itemDetail;

  const sum = seats.selectedSeat.reduce((acc, cur, i) => {
    return acc + concertInfo.prices[cur.class];
  }, 0);

  const clickPay = () => {
    const seatsData = seats.selectedSeat.map((seat: any) => {
      return seat._id;
    });
    bookItem({
      variables: {
        userId: localStorage.getItem("userid"),
        itemId: concertInfo.id,
        scheduleId: concertInfo.scheduleId,
        seats: seatsData,
      },
    });
  };

  return (
    <>
      <Box className={classes.selectInfo}>
        <Box className={classes.title}>
          <strong className={classes.text}>{name}</strong>
          <Box className={classes.date}>
            {concertInfo.dateDetail}, 총 {seats.selectedSeat.length}매
          </Box>
          <Box className={classes.changeBtn} onClick={onClickChange}>
            변경
          </Box>
        </Box>
        <Box className={classes.seatInfo}>
          {seats.selectedSeat.map((seat, idx) => {
            return (
              <Box key={idx} className={classes.grade}>
                <Box className={classes.gradeText}>
                  <Badge component="span" color={concertInfo.colors[seat.class]} />
                  <span>{seat.class}</span>
                </Box>
                <Box className={classes.seatText}>{seat.name}</Box>
                <Box className={classes.priceText}>
                  {intl.format(concertInfo.prices[seat.class])}원
                </Box>
              </Box>
            );
          })}
        </Box>
        <Box className={classes.total}>
          <span>합계</span>
          <strong className={classes.price}>{intl.format(sum)}원</strong>
        </Box>
      </Box>
      <StepButton click={clickPay} link="/" next="결제완료" />
    </>
  );
}

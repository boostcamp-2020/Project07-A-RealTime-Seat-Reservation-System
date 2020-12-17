import React, { useState, useEffect, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { useMutation, gql } from "@apollo/client";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { colors } from "../../styles/variables";
import { Booking, StateType } from "../../types/booking";
import WebSharedWorker from "../../worker/WebWorker";

const useStyles = makeStyles(() => ({
  card: {
    margin: "16px",
    backgroundColor: colors.naverWhite,
    borderRadius: "15px",
    boxShadow: "0 2px 6px 0 rgba(0,0,0,0.05), 0 0 1px 0 rgba(0,21,81,0.05)",
  },
  upperBox: {
    overflow: "hidden",
    margin: "0 24px",
    padding: "19px 0 16px",
    borderBottom: "1px dashed #e4e8ed",
  },
  highlight: {
    boxShadow: "inset 0 -5px 0 #e0f7f4",
    fontSize: "20px",
    fontWeight: "bold",
    letterSpacing: "-0.3px",
    color: "#333",
  },
  lowerBox: {
    margin: "0 24px",
    padding: "19px 0",
  },
  infoArea: {
    marginBottom: "16px",
  },
  info: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "16px",
    fontWeight: "bold",
    letterSpacing: "-0.3px",
    color: "#333",
  },
  cancelBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "40px",
    padding: "0 5px",
    fontSize: "14px",
    fontWeight: "bold",
    backgroundColor: colors.myPagePurple,
    borderRadius: "3px",
    color: colors.naverWhite,
    lineHeight: "28px",
    cursor: "pointer",
  },
  titleText: {
    marginBottom: "8px",
    color: colors.myPagePurple,
    fontSize: "20px",
    lineHeight: "28px",
    letterSpacing: "-0.4px",
    wordBreak: "keep-all",
    fontWeight: 600,
  },
}));

export default function BookingCancelArea() {
  const [userName, setUserName] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const [booking, setBooking] = useState<any>();
  const location = useLocation<StateType>();
  const [concert, setConcert] = useState<Booking>({
    _id: "",
    item: { name: "" },
    schedule: { _id: "", date: "" },
    seats: [],
  });
  useEffect(() => {
    if (!location.state) {
      alert("취소할 공연을 선택해주세요.");
      history.replace("/mypage");
    } else {
      const { _id, item, schedule, seats } = location.state.booking;
      setConcert({ ...concert, _id: _id, item: item, schedule: schedule, seats: [...seats] });
    }
  }, []);

  const socketWorker = WebSharedWorker;

  const CANCEL_ITEM = gql`
    mutation CancelItem($userId: ID, $bookingId: ID) {
      cancelItem(userId: $userId, bookingId: $bookingId) {
        result
      }
    }
  `;
  const [cancelItem] = useMutation(CANCEL_ITEM);

  const handleOnClick = () => {
    const answer = confirm("취소하시겠습니까?");
    if (answer) {
      cancelItem({
        variables: {
          userId: localStorage.getItem("userid"),
          bookingId: concert._id,
        },
      });
      history.replace("/mypage");
    }
    if (!answer) {
      socketWorker.postMessage({
        type: "notCancelBooking",
        userId: localStorage.getItem("userid"),
      });
      history.replace("/mypage");
    }
  };
  const { _id, item, schedule, seats } = concert;
  return (
    <>
      <Box className={classes.card}>
        <Box className={classes.upperBox}>
          <span className={classes.highlight}>{item.name}</span>
        </Box>
        <Box className={classes.lowerBox}>
          <Box className={classes.infoArea}>
            <Box className={classes.titleText}>일정</Box>
            <Box className={classes.info}>{schedule.date}</Box>
          </Box>
          <Box className={classes.infoArea}>
            <Box className={classes.titleText}>좌석 정보</Box>
            {seats.map((seat, idx) => {
              return (
                <Box key={idx} className={classes.info}>
                  {seat.class} {seat.name}
                </Box>
              );
            })}
          </Box>
          <Box className={classes.cancelBtn} onClick={handleOnClick}>
            취소하기
          </Box>
        </Box>
      </Box>
    </>
  );
}

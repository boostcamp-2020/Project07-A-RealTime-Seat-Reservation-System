import React, { useState, useEffect, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { useQuery, gql } from "@apollo/client";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { colors } from "../../styles/variables";
import { Loading } from "../common";

const useStyles = makeStyles(() => ({
  userInfoArea: {
    padding: "22px 20px",
    backgroundColor: colors.naverWhite,
    marginTop: "12px",
    marginBottom: "8px",
    boxShadow: "0 2px 6px 0 rgba(0,0,0,0.05), 0 0 1px 0 rgba(0,21,81,0.05)",
  },
  titleText: {
    color: colors.myPageBlack,
    fontSize: "20px",
    lineHeight: "28px",
    letterSpacing: "-0.4px",
    wordBreak: "keep-all",
  },
  point: {
    color: colors.myPagePurple,
  },
  card: {
    marginTop: "13px",
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
    fontSize: "15px",
    fontWeight: "bold",
    letterSpacing: "-0.3px",
    color: "#333",
  },
  lowerBox: {
    display: "flex",
    margin: "0 24px",
    padding: "19px 0",
  },
  info: {
    flex: 4,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "16px",
    fontWeight: "bold",
    letterSpacing: "-0.3px",
    color: "#333",
  },
  cancelBtn: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    height: "28px",
    padding: "0 5px",
    fontSize: "14px",
    backgroundColor: colors.myPagePurple,
    borderRadius: "3px",
    color: colors.naverWhite,
    lineHeight: "28px",
    cursor: "pointer",
  },
  loading: {
    width: "100%",
    padding: "100px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function MyPageArea() {
  const [userName, setUserName] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const [bookingList, setBookingList] = useState<any>([]);

  const GET_BOOKING_LIST = gql`
    query BookingListByUserId($userId: ID) {
      bookingListByUserId(userId: $userId) {
        _id
        item {
          name
        }
        schedule {
          _id
          date
        }
        seats {
          _id
          class
          name
          status
          color
        }
      }
    }
  `;
  const { loading, error, data, refetch } = useQuery(GET_BOOKING_LIST, {
    variables: { userId: localStorage.getItem("userid") },
  });

  useEffect(() => {
    refetch();
    if (data) setBookingList([...data.bookingListByUserId]);
    console.log(bookingList);
  }, [data]);

  const handleClickCancel = (e: any) => {
    history.push({
      pathname: "/cancel",
      state: {
        booking: data.bookingListByUserId[e.target.id],
      },
    });
  };
  if (loading)
    return (
      <Box className={classes.loading}>
        <Loading />
      </Box>
    );
  if (error) return <>`Error! ${error.message}`</>;

  return (
    <>
      <Box className={classes.userInfoArea}>
        <strong className={classes.titleText}>
          어서오세요, <span className={classes.point}>{localStorage.userName}</span>님!
          <br />총 <span className={classes.point}>{bookingList.length}</span>개의 예매내역이
          있습니다.
        </strong>
      </Box>
      <Box className={classes.userInfoArea}>
        <strong className={classes.titleText}>취소 가능한 예약</strong>
        {data.bookingListByUserId.map((element: any, idx: any) => {
          return (
            <Box key={idx} className={classes.card}>
              <Box className={classes.upperBox}>
                <span className={classes.highlight}>{element.item.name}</span>
              </Box>
              <Box className={classes.lowerBox}>
                <Box className={classes.info}>{element.schedule.date}</Box>
                <Box id={idx} className={classes.cancelBtn} onClick={handleClickCancel}>
                  예매 취소
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </>
  );
}

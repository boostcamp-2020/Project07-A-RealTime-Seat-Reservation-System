import React, { useContext, useEffect, useState } from "react";
import { Paper, Box, List, ListItem } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { colors } from "../../../styles/variables";
import { useQuery, gql } from "@apollo/client";
import useConcertInfo from "../../../hooks/useConcertInfo";
import { StepButton, Badge } from "../../common";
import { Loading } from "../../common";
import WebSharedWorker from "../../../worker/WebWorker";
import { SocketContext } from "../../../stores/SocketStore";

const useStyles = makeStyles((theme: Theme) => ({
  seatInfoArea: {
    position: "fixed",
    bottom: "30px",
    width: "414px",
    height: "15rem",
    fontWeight: "bold",
    borderRadius: "0.5rem 0.5rem 0 0",
  },
  seatInfoTitle: {
    display: "flex",
    width: "100%",
    paddingTop: "1rem",
    color: colors.naverFontBlack,
    fontWeight: 600,
  },
  infoTitle: {
    float: "left",
    width: "35%",
    padding: "0 0 8px 18px",
  },
  seatTitle: {
    float: "left",
    width: "55%",
    padding: "0 0 0.5rem 0.75rem",
  },
  count: {
    marginLeft: "3px",
    color: "#3787ff",
  },
  seatInfo: {
    overflow: "hidden",
    borderTop: `1px solid ${colors.borderGray}`,
  },
  info: {
    float: "left",
    overflowY: "auto",
    width: "40%",
    minHeight: "151px",
    maxHeight: "151px",
    padding: "5px 18px",
    boxSizing: "border-box",
    borderRight: `1px solid ${colors.borderGray}`,
  },
  seat: {
    float: "left",
    overflowY: "auto",
    width: "60%",
    maxHeight: "151px",
    padding: "0px 12px 6px 18px",
    boxSizing: "border-box",
    borderRight: `1px solid ${colors.borderGray}`,
  },
  item: {
    display: "table",
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
    display: "table-cell",
    color: "#666",
    textAlign: "right",
    whiteSpace: "nowrap",
    fontWeight: "normal",
  },
  seatLoca: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: "0",
    fontWeight: "normal",
  },
  cancel: {
    cursor: "pointer",
  },
  loading: {
    width: "100%",
    padding: "50px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function SeatInfoArea() {
  const socketWorker = WebSharedWorker;
  const concertInfo = useConcertInfo();
  const classes = useStyles();
  const { socketData, cancelSeat } = useContext(SocketContext);

  const GET_ITEMS = gql`
    query ItemDetail($id: ID) {
      itemDetail(itemId: $id) {
        classes {
          class
          color
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_ITEMS, {
    variables: { id: concertInfo.id },
  });

  const handleClickCancel = (seat: any) => {
    cancelSeat(seat._id);

    socketWorker.postMessage({
      type: "clickSeat",
      userId: localStorage.getItem("userid"),
      scheduleId: concertInfo.scheduleId,
      seat: seat,
      status: "clicked",
    });
  };

  const handleClickPayment = () => {
    const seatIdArray = socketData.selectedSeats.map((seat: any) => seat._id);

    socketWorker.postMessage({
      type: "joinBookingRoom",
      userId: localStorage.getItem("userid"),
      scheduleId: concertInfo.scheduleId,
      seatIdArray,
    });
  };

  if (loading)
    return (
      <Box className={classes.seatInfoArea}>
        <Box className={classes.loading}>
          <Loading />
        </Box>
      </Box>
    );
  if (error) return <>`Error! ${error.message}`</>;

  const { classes: colorInfo } = data.itemDetail;
  const colors = colorInfo.reduce((acc: any, value: any, idx: any, arr: any) => {
    acc[value.class] = value.color;
    return acc;
  }, {});

  return (
    <>
      <Paper elevation={3} className={classes.seatInfoArea}>
        <Box className={classes.seatInfoTitle}>
          <Box className={classes.infoTitle}>잔여석</Box>
          <Box className={classes.seatTitle}>
            선택좌석
            <Box component="span" className={classes.count}>
              {socketData.selectedSeats.length}석
            </Box>
          </Box>
        </Box>
        <Box className={classes.seatInfo}>
          <Box className={classes.info}>
            <List dense={true}>
              {Object.keys(socketData.realTimeCounts).map((element, idx) => {
                return (
                  <ListItem key={idx} className={classes.item}>
                    <Box className={classes.title}>
                      <Badge component="span" color={colors[element]}></Badge>
                      <span>{element}</span>
                    </Box>
                    <Box className={classes.seatCount}>{socketData.realTimeCounts[element]}석</Box>
                  </ListItem>
                );
              })}
            </List>
          </Box>
          <Box className={classes.seat}>
            <List dense={true}>
              {socketData.selectedSeats.map((element: any, idx: any) => {
                return (
                  <ListItem key={idx} className={classes.item}>
                    <Box className={classes.seatLoca}>
                      <span>
                        <Badge component="span" color={colors[element.class]}></Badge>
                        <span>{element.name}</span>
                      </span>
                      <CloseIcon
                        className={classes.cancel}
                        fontSize="small"
                        onClick={() => handleClickCancel(element)}
                      />
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Box>
      </Paper>
      <StepButton click={handleClickPayment} link="/payment" next="다음단계" />
    </>
  );
}

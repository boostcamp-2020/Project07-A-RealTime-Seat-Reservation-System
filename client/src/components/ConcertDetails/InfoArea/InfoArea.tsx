import React, { useState, useEffect, PropsWithRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { useQuery, gql } from "@apollo/client";
import { colors } from "../../../styles/variables";
import { Badge } from "../../common";
import { SEAT_COLOR } from "../../../styles/seatColor";
import useConcertInfo from "../../../hooks/useConcertInfo";

const useStyles = makeStyles(() => ({
  infoArea: {
    overflow: "hidden",
    margin: "0 21px",
    padding: "15px 0 24px",
    color: colors.naverFontBlack,
  },
  infoMain: {
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: `1px solid ${colors.borderLightGray2}`,
  },
  mainTitle: {
    paddingBottom: "8px",
    fontSize: "20px",
    letterSpacing: "-0.5px",
  },
  mainText: {
    paddingTop: "4px",
    color: colors.naverFontDarkGray,
  },
  mainSubText: {
    fontWeight: "bold",
    marginBottom: "8px",
  },
}));

export default function InfoArea() {
  const classes = useStyles();
  const GET_SCHEDULE = gql`
    query GetItem($id: ID) {
      scheduleListByMonth(itemId: $id) {
        _id
        date
      }
    }
  `;
  return (
    <>
      <Box className={classes.infoArea}>
        <Box className={classes.infoMain}>
          <strong className={classes.mainTitle}>예매 유의사항</strong>
          <p className={classes.mainText}>
            <Box className={classes.mainSubText}>💎예매시 좌석도의 색💎</Box>
            1️⃣ 판매 완료된 좌석: <Badge component="span" color={SEAT_COLOR.SOLD} /> <br />
            2️⃣ 다른 사용자가 선택한 좌석: <Badge component="span" color={SEAT_COLOR.CLICKED} />{" "}
            <br />
            3️⃣ 다른 사용자가 예매 취소중인 좌석:{" "}
            <Badge component="span" color={SEAT_COLOR.CANCEELED} />
            <br />
            4️⃣ 내가 선택한 좌석: <Badge component="span" color={SEAT_COLOR.MYSEAT} /> <br />
            5️⃣ 선택 가능한 좌석: 각 등급별 색
          </p>
        </Box>
      </Box>
    </>
  );
}

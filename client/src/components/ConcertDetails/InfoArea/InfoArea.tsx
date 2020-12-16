import React, { useState, useEffect, PropsWithRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { useQuery, gql } from "@apollo/client";
import { colors } from "../../../styles/variables";
import { Badge } from "../../common";
import { SEAT_COLOR } from "../../../styles/seatColor";
import useConcertInfo from "../../../hooks/useConcertInfo";
import { Loading } from "../../common";
import { ko } from "date-fns/locale";
import { format } from "date-fns";

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
    marginBottom: "16px",
    paddingBottom: "8px",
    fontSize: "20px",
    letterSpacing: "-0.5px",
  },
  mainText: {
    marginTop: "16px",
    color: colors.naverFontDarkGray,
  },
  mainSubText: {
    fontWeight: "bold",
    marginTop: "4px",
    marginBottom: "8px",
  },
  loading: {
    width: "100%",
    padding: "50px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: "100%",
    marginTop: "20px",
  },
}));

export default function InfoArea() {
  const classes = useStyles();
  const concertInfo = useConcertInfo();
  const intl = new Intl.NumberFormat("ko-KR");
  const GET_SCHEDULE = gql`
    query ScheduleListByMonth($id: ID) {
      scheduleListByMonth(itemId: $id) {
        date
      }
      itemDetail(itemId: $id) {
        detailInfoImg
      }
    }
  `;
  const { loading, error, data } = useQuery(GET_SCHEDULE, {
    variables: { id: concertInfo.id },
  });
  if (loading)
    return (
      <Box className={classes.loading}>
        <Loading />
      </Box>
    );
  if (error) return <>`Error! ${error.message}`</>;
  console.log(data);
  return (
    <>
      <Box className={classes.infoArea}>
        <Box className={classes.infoMain}>
          <strong className={classes.mainTitle}>예매 유의사항</strong>
          <div className={classes.mainText}>
            <Box className={classes.mainSubText}>💎예매시 좌석도의 색💎</Box>
            1️⃣ 판매 완료된 좌석: <Badge component="span" color={SEAT_COLOR.SOLD} /> <br />
            2️⃣ 다른 사용자가 선택한 좌석: <Badge component="span" color={SEAT_COLOR.CLICKED} />{" "}
            <br />
            3️⃣ 다른 사용자가 예매 취소중인 좌석:{" "}
            <Badge component="span" color={SEAT_COLOR.CANCEELED} />
            <br />
            4️⃣ 내가 선택한 좌석: <Badge component="span" color={SEAT_COLOR.MYSEAT} /> <br />
            5️⃣ 선택 가능한 좌석: 각 등급별 색
          </div>
        </Box>
        <Box className={classes.infoMain}>
          <strong className={classes.mainTitle}>공연 스케줄 안내</strong>
          <div className={classes.mainText}>
            {data.scheduleListByMonth.map((element: any, idx: any) => {
              return (
                <Box key={idx}>
                  {format(new Date(element.date), "yyyy.M.d(ccc) a h:mm", { locale: ko })}
                </Box>
              );
            })}
          </div>
        </Box>
        {data.itemDetail.detailInfoImg ? (
          <Box className={classes.infoMain}>
            <strong className={classes.mainTitle}>상세정보</strong>
            <img className={classes.img} src={data.itemDetail.detailInfoImg} />
          </Box>
        ) : null}
      </Box>
    </>
  );
}

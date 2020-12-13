import React, { useEffect, useState, useContext } from "react";
import { Paper, Box, List, ListItem } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { colors } from "../../../styles/variables";
import useSeats from "../../../hooks/useSeats";
import useCancelSeat from "../../../hooks/useCancelSeat";
import { socket } from "../../../socket";
import { useHistory } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { SeatContext } from "../../../stores/SeatStore";
import useConcertInfo from "../../../hooks/useConcertInfo";
import { StepButton, Badge } from "../../common";
import { Loading } from "../../common";

interface SeatInfo {
  color: string;
  price: number;
}
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

const unsold = "#01DF3A";

export default function SeatInfoArea() {
  const concertInfo = useConcertInfo();
  const classes = useStyles();
  const seats = useSeats();
  const cancelSeat = useCancelSeat();
  const history = useHistory();
  const [seatsCount, setSeatsCount] = useState<any>({});
  const { serverSeats } = useContext(SeatContext);

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
    seat.status = "clicked";
    cancelSeat(seat._id);
    socket.emit("clickSeat", localStorage.getItem("userid"), concertInfo.scheduleId, seat._id);
  };
  useEffect(() => {
    setSeatsCount({ ...serverSeats.counts });
  }, []);
  useEffect(() => {
    setSeatsCount({ ...serverSeats.counts });
  }, [serverSeats.counts]);

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
              {seats.selectedSeat.length}석
            </Box>
          </Box>
        </Box>
        <Box className={classes.seatInfo}>
          <Box className={classes.info}>
            <List dense={true}>
              {Object.keys(seatsCount).map((element, idx) => {
                return (
                  <ListItem key={idx} className={classes.item}>
                    <Box className={classes.title}>
                      <Badge component="span" color={colors[element]}></Badge>
                      <span>{element}</span>
                    </Box>
                    <Box className={classes.seatCount}>{seatsCount[element]}석</Box>
                  </ListItem>
                );
              })}
            </List>
          </Box>
          <Box className={classes.seat}>
            <List dense={true}>
              {seats.selectedSeat.map((element, idx) => {
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
      <StepButton click={undefined} link="/payment" next="다음단계" />
    </>
  );
}

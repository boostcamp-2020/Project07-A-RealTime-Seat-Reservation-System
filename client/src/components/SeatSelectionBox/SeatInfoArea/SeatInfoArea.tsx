import React from "react";
import { Paper, Box, List, ListItem } from "@material-ui/core";
import { makeStyles, Theme, styled } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { colors } from "../../../styles/variables";

interface seatInfo {
  color: string;
  name: string;
  count: number;
}
interface selectedInfo {
  color: string;
  info: string;
}
interface props {
  selectedSeatCount: number;
  seatInfo: Array<seatInfo>;
  selectedSeat: Array<selectedInfo>;
}
interface styleProps {
  color: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  seatInfoArea: {
    height: "15rem",
    fontWeight: "bold",
    borderRadius: "0.5rem",
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
    display: "table-cell",
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
  grade: {},
}));

const Badge = styled(Box)((props: styleProps) => ({
  display: "inline-block",
  width: "13px",
  height: "13px",
  top: "3px",
  marginRight: "0.5rem",
  backgroundColor: props.color,
}));

export default function SeatInfoArea({
  selectedSeatCount,
  seatInfo,
  selectedSeat,
}: props) {
  const classes = useStyles();
  return (
    <>
      <Paper elevation={3} className={classes.seatInfoArea}>
        <Box className={classes.seatInfoTitle}>
          <Box className={classes.infoTitle}>잔여석</Box>
          <Box className={classes.seatTitle}>
            선택좌석
            <Box component="span" className={classes.count}>
              {selectedSeatCount}석
            </Box>
          </Box>
        </Box>
        <Box className={classes.seatInfo}>
          <Box className={classes.info}>
            <List dense={true}>
              {seatInfo.map((element, idx) => {
                return (
                  <ListItem key={idx} className={classes.item}>
                    <Box className={classes.title}>
                      <Badge component="span" color={element.color}></Badge>
                      <span>{element.name}</span>
                    </Box>
                    <Box className={classes.seatCount}>{element.count}석</Box>
                  </ListItem>
                );
              })}
            </List>
          </Box>
          <Box className={classes.seat}>
            <List dense={true}>
              {selectedSeat.map((element, idx) => {
                return (
                  <ListItem key={idx} className={classes.item}>
                    <Box className={classes.title}>
                      <Badge component="span" color={element.color}></Badge>
                      <span>
                        <span>{element.info}</span>
                        <CloseIcon />
                      </span>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Box>
      </Paper>
    </>
  );
}

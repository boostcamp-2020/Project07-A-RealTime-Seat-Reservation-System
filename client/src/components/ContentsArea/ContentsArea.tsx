import { Box } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import { colors } from "../../styles/variables";
import tmp from "../../imgs/tmp.jpg";
import useConcertInfo from "../../hooks/useConcertInfo";
import DateRangeOutlinedIcon from "@material-ui/icons/DateRangeOutlined";
import PlayCircleFilledWhiteOutlinedIcon from "@material-ui/icons/PlayCircleFilledWhiteOutlined";

const useStyles = makeStyles((theme: Theme) => ({
  poster: {
    backgroundImage: `url(${tmp})`,
    minHeight: "210px",
    backgroundSize: "cover",
    backgroundPosition: "50% 50%",
  },
  contents: {
    paddingBottom: "14px",
    padding: "0 20px 14px",
    borderBottom: `1px solid ${colors.borderLightGray}`,
    backgroundColor: `${colors.naverWhite}`,
  },
  contentsTop: {
    height: "100%",
  },
  titleArea: {
    paddingTop: "1rem",
    letterSpacing: "-1px",
  },
  title: {
    paddingTop: "5px",
    fontSize: "24px",
    lineHeight: "27px",
    color: `${colors.naverFontBlack}`,
    maxHeight: "54px",
  },
  price: {
    minHeight: "24px",
    paddingTop: "4px",
    fontSize: "21px",
    lineHeight: "24px",
    color: `${colors.naverRed}`,
  },
  infoArea: {
    paddingTop: "7px",
    fontSize: "15px",
    lineHeight: "23px",
    color: `${colors.naverFontSub}`,
  },
  infoIcon: {
    width: "0.9rem",
    height: "0.9rem",
    marginRight: "3px",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
  },
}));
export default function ContentsArea() {
  const classes = useStyles();
  const concertInfo = useConcertInfo();
  return (
    <>
      <Box className={classes.poster}></Box>
      <Box className={classes.contents}>
        <Box className={classes.contentsTop}>
          <Box className={classes.titleArea}>
            <strong className={classes.title}>{concertInfo.title}</strong>
            <Box className={classes.price}>
              <strong>{concertInfo.price}</strong>
            </Box>
          </Box>
          <Box className={classes.infoArea}>
            <Box className={classes.infoRow}>
              <DateRangeOutlinedIcon
                className={classes.infoIcon}
                fontSize="small"
              />
              <span>{concertInfo.period}</span>
            </Box>
            <Box className={classes.infoRow}>
              <PlayCircleFilledWhiteOutlinedIcon
                className={classes.infoIcon}
                fontSize="small"
              />
              <span>
                {concertInfo.runningTime}, {concertInfo.class}
              </span>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

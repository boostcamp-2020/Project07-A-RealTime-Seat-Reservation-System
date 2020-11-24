import { AppBar, Toolbar, IconButton, Typography } from "@material-ui/core";
import TodayIcon from "@material-ui/icons/Today";
import { styled, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import { colors } from "../../../styles/variables";

interface props {
  dateInfo: string;
}

const Header = styled(AppBar)({
  height: "3.2rem",
  background: colors.naverWhite,
  color: "#000000",
});
const Box = styled(Toolbar)({
  minHeight: "3.2rem",
  justifyContent: "flex-start",
  padding: "0 1rem",
});
const useStyles = makeStyles((theme: Theme) => ({
  title: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#000000",
    fontSize: "1rem",
    fontWeight: "bold",
  },
}));
export default function SeatSelectionBox({ dateInfo }: props) {
  const classes = useStyles();
  return (
    <>
      <Header position="static">
        <Box>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <TodayIcon />
          </IconButton>
          <Typography className={classes.title}>{dateInfo}</Typography>
        </Box>
      </Header>
    </>
  );
}

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { styled, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import { colors } from "../../styles/variables";

interface props {
  title: string;
}

const Header = styled(AppBar)({
  height: "3rem",
  background: colors.naverGreen,
});
const Box = styled(Toolbar)({
  minHeight: "3rem",
  justifyContent: "space-between",
  padding: "0 1rem",
});
const MyButton = styled(Button)({
  fontSize: "1.4rem",
  fontWeight: 100,
});
const useStyles = makeStyles((theme: Theme) => ({
  title: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));
export default function MainHeader({ title }: props) {
  const classes = useStyles();
  return (
    <>
      <Header position="static">
        <Box>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          <MyButton color="inherit">MY</MyButton>
        </Box>
      </Header>
    </>
  );
}

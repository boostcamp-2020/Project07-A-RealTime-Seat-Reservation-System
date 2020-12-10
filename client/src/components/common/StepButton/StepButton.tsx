import React from "react";
import { Box, Button } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { colors } from "../../../styles/variables";
import { useHistory } from "react-router-dom";
import { socket } from "../../../socket";

interface Props {
  link: string;
  next: string;
  click?: Function;
}

const useStyles = makeStyles((theme: Theme) => ({
  stepBtn: {
    position: "fixed",
    width: "402px",
    bottom: "0",
    padding: "6px",
    backgroundColor: "#efefef",
    borderTop: "1px solid #dbdbdb",
  },
  beforeBtn: {
    width: "39%",
    height: "51px",
    marginRight: "1%",
    backgroundColor: `${colors.naverWhite}`,
    borderRadius: "0",
    border: `1px solid rgba(0,0,0,0.15)`,
    fontWeight: "bold",
  },
  nextBtn: {
    width: "59%",
    height: "51px",
    marginLeft: "1%",
    backgroundColor: `${colors.naverGreen}`,
    borderRadius: "0",
    fontWeight: "bold",
    fontColor: `${colors.naverWhite}`,
  },
}));

export default function StepButton({ link, next, click }: Props) {
  const history = useHistory();
  const classes = useStyles();

  const handleClickPre = () => {
    history.goBack();
  };

  const handleClickNext = () => {
    if (click) click();

    if (next === "결제완료") {
    }
    history.push({
      pathname: link,
    });
  };
  return (
    <Box className={classes.stepBtn}>
      <Button
        size="large"
        variant="contained"
        onClick={handleClickPre}
        className={classes.beforeBtn}
      >
        이전단계
      </Button>
      <Button
        size="large"
        variant="contained"
        onClick={handleClickNext}
        className={classes.nextBtn}
      >
        {next}
      </Button>
    </Box>
  );
}

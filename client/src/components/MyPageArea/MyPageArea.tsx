import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { useMutation, gql } from "@apollo/client";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setUser } from "../../modules/user";
import { colors } from "../../styles/variables";

const LOGIN = gql`
  mutation login($userName: String) {
    loginUser(userName: $userName) {
      _id
      userName
    }
  }
`;

const useStyles = makeStyles(() => ({
  userInfoArea: {
    padding: "22px 20px 0",
    backgroundColor: colors.naverWhite,
    marginTop: "12px",
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
}));

export default function MyPageArea() {
  const [userName, setUserName] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const [login] = useMutation(LOGIN);
  const classes = useStyles();

  return (
    <>
      <Box className={classes.userInfoArea}>
        <strong className={classes.titleText}>
          어서오세요, <span className={classes.point}>{localStorage.userName}</span>님!
        </strong>
      </Box>
    </>
  );
}

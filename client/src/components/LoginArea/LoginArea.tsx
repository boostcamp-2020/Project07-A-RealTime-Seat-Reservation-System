import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useMutation, gql } from "@apollo/client";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setUser } from "../../modules/user";

const LOGIN = gql`
  mutation login($userName: String) {
    loginUser(userName: $userName) {
      _id
      userName
    }
  }
`;

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    marginTop: "1rem",
    marginBottom: "1rem",
  },
}));

export default function LoginArea() {
  const [userName, setUserName] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const [login] = useMutation(LOGIN);
  const loginAreaStyles = useStyles();

  const loginHandler = async () => {
    const data = await login({ variables: { userName } });

    if (data) {
      const { _id, userName } = data.data.loginUser;
      dispatch(setUser({ _id, userName }));
      localStorage.setItem("userid", _id);
      localStorage.setItem("userName", userName);
      history.push("/");
    }
  };

  const handleChange = (e: any) => {
    setUserName(e.target.value);
  };

  return (
    <div className={loginAreaStyles.root}>
      <TextField
        id="outlined-name"
        label="ID"
        placeholder="아이디를 입력해주세요"
        onChange={handleChange}
        variant="outlined"
        type="search"
      />
      <Button variant="contained" onClick={loginHandler}>
        로그인
      </Button>
    </div>
  );
}

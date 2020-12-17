import React, { useEffect } from "react";
import { MainHeader, MyPageArea } from "../components";
import { useHistory } from "react-router-dom";

export default function MyPage() {
  const histroy = useHistory();
  useEffect(() => {
    if (!localStorage.userid) {
      alert("로그인이 필요합니다.");
      histroy.replace("/login");
    }
  }, []);

  return (
    <>
      <MainHeader title="마이페이지" />
      <MyPageArea />
    </>
  );
}

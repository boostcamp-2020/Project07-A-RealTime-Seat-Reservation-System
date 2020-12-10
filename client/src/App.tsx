import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {
  SeatSelection,
  SelectTime,
  Payment,
  ItemList,
  Login,
  MyPage,
  BookingCancel,
} from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={ItemList} />
        <Route path="/seat" component={SeatSelection} />
        <Route path="/payment" component={Payment} />
        <Route path="/login" component={Login} />
        <Route path="/schedule/:concertId" component={SelectTime} />
        <Route path="/mypage" component={MyPage} />
        <Route path="/cancel" component={BookingCancel} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;

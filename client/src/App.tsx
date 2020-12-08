import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { SeatSelection, SelectTime, Payment, ItemList, Login } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={ItemList} />
        <Route path="/seat" component={SeatSelection} />
        <Route path="/payment" component={Payment} />
        <Route path="/schedule" component={SelectTime} />
        <Route path="/login" component={Login} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;

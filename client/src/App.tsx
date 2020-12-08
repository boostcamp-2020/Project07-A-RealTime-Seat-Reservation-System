import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { SeatSelection, SelectTime, Payment, ItemList } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={ItemList} />
        <Route path="/seat" component={SeatSelection} />
        <Route path="/payment" component={Payment} />
        <Route path="/schedule/:concertId" component={SelectTime} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;

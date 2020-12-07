import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { SeatSelection, SelectTime, Payment, ItemList } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={SelectTime} />
        <Route path="/seat" component={SeatSelection} />
        <Route path="/payment" component={Payment} />
        <Route path="/items" component={ItemList} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;

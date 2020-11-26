import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { SeatSelection, SelectTime } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={SelectTime} />
        <Route path="/seat" component={SeatSelection} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;

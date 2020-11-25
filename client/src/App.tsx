import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { SeatSelection, SelectTime } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/seat" component={SeatSelection} />
        <Route path="/time" component={SelectTime} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;

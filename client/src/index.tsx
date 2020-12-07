import "./index.css";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./modules";
import { SeatStore } from "./stores/SeatStore";
import client from "./service";
import { ApolloProvider } from "@apollo/client";

const store = createStore(rootReducer);

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <SeatStore>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </SeatStore>
    </Provider>
  </ApolloProvider>,
  document.getElementById("root"),
);

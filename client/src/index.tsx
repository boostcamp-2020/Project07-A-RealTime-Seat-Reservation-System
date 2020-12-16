import "./index.css";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./modules";
import client from "./service";
import { SocketStore } from "./stores/SocketStore";

import { ApolloProvider } from "@apollo/client";

const store = createStore(rootReducer);

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <SocketStore>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </SocketStore>
    </Provider>
  </ApolloProvider>,
  document.getElementById("root"),
);

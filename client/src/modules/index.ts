import { combineReducers } from "redux";
import socketReducer from "./socket";
import seatsReducer from "./seats";
import concertInfoReducer from "./concertInfo";

const rootReducer = combineReducers({
  socketReducer,
  seatsReducer,
  concertInfoReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;

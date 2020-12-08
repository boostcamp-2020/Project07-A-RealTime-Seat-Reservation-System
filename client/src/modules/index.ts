import { combineReducers } from "redux";
import socketReducer from "./socket";
import seatsReducer from "./seats";
import concertInfoReducer from "./concertInfo";
import userReducer from "./user";

const rootReducer = combineReducers({
  socketReducer,
  seatsReducer,
  concertInfoReducer,
  userReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;

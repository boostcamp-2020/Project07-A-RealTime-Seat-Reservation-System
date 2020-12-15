import { combineReducers } from "redux";
import seatsReducer from "./seats";
import concertInfoReducer from "./concertInfo";
import userReducer from "./user";

const rootReducer = combineReducers({
  seatsReducer,
  concertInfoReducer,
  userReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;

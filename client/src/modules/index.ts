import { combineReducers } from "redux";
import concertInfoReducer from "./concertInfo";
import userReducer from "./user";

const rootReducer = combineReducers({
  concertInfoReducer,
  userReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;

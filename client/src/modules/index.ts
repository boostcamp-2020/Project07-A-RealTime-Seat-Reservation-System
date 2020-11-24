import { combineReducers } from "redux";
import socketReducer from "./socket";
import seatsReducer from "./seats";

const rootReducer = combineReducers({
  socketReducer,
  seatsReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;

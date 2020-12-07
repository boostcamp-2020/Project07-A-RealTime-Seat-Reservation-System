import { combineReducers } from "redux";
import socketReducer from "./socket";
import seatsReducer from "./seats";
import concertInfoReducer from "./concertInfo";
import itemsReducer from "./items";

const rootReducer = combineReducers({
  socketReducer,
  seatsReducer,
  concertInfoReducer,
  itemsReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;

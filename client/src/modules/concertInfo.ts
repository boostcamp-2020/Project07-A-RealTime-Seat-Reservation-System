import { Prices } from "../types/concertInfo";

const CHANGE_SELECTED_CONCERT = "concertInfo/CHANGE_SELECTED_CONCERT" as const;
const SELECT_SCHEDULE = "concertInfo/SELECT_SCHEDULE" as const;
const SET_PRICE = "concertInfo/SET_PRICE" as const;

export const changeSelectedConcert = (id: string) => ({
  type: CHANGE_SELECTED_CONCERT,
  payload: id,
});

export const selectSchedule = (id: string, dateDetail: string) => ({
  type: SELECT_SCHEDULE,
  payload: { id, dateDetail },
});

export const setPrice = (prices: Prices[]) => ({
  type: SET_PRICE,
  payload: prices,
});

export interface ConcertInfo {
  id: string;
  name: string;
  scheduleId?: string;
  dateDetail: string;
  price?: Prices[];
  startDate?: string;
  endDate?: string;
  runningTime?: string;
  class?: string;
}

type ConcertInfoAction =
  | ReturnType<typeof changeSelectedConcert>
  | ReturnType<typeof selectSchedule>
  | ReturnType<typeof setPrice>;

type ConcertInfoState = ConcertInfo;

const initialState: ConcertInfoState = {
  id: "",
  name: "",
  scheduleId: undefined,
  dateDetail: "",
  price: undefined,
  startDate: undefined,
  endDate: undefined,
  runningTime: "2시간 45분",
  class: "8세이상 관람가",
};

const concertInfoReducer = (
  state: ConcertInfoState = initialState,
  action: ConcertInfoAction,
): ConcertInfoState => {
  switch (action.type) {
    case CHANGE_SELECTED_CONCERT:
      return {
        ...state,
        id: action.payload,
      };
    case SELECT_SCHEDULE:
      return {
        ...state,
        scheduleId: action.payload.id,
        dateDetail: action.payload.dateDetail,
      };
    case SET_PRICE:
      return {
        ...state,
        price: action.payload,
      };
    default:
      return state;
  }
};

export default concertInfoReducer;

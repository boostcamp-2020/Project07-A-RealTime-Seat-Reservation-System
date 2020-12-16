const CHANGE_SELECTED_CONCERT = "concertInfo/CHANGE_SELECTED_CONCERT" as const;
const SELECT_SCHEDULE = "concertInfo/SELECT_SCHEDULE" as const;
const SET_CLASS_INFO = "concertInfo/SET_CLASS_INFO" as const;

export const changeSelectedConcert = (id: string, name: string) => ({
  type: CHANGE_SELECTED_CONCERT,
  payload: { id, name },
});

export const selectSchedule = (id: string, dateDetail: string) => ({
  type: SELECT_SCHEDULE,
  payload: { id, dateDetail },
});

export const setClassInfo = (prices: Object, colors: Object) => ({
  type: SET_CLASS_INFO,
  payload: { prices, colors },
});

export interface ConcertInfo {
  id: string;
  name: string;
  scheduleId?: string;
  dateDetail: string;
  prices: any;
  colors?: any;
  startDate?: string;
  endDate?: string;
  runningTime?: string;
  class?: string;
}

type ConcertInfoAction =
  | ReturnType<typeof changeSelectedConcert>
  | ReturnType<typeof selectSchedule>
  | ReturnType<typeof setClassInfo>;

type ConcertInfoState = ConcertInfo;

const initialState: ConcertInfoState = {
  id: "",
  name: "",
  scheduleId: undefined,
  dateDetail: "",
  prices: {},
  colors: undefined,
  startDate: undefined,
  endDate: undefined,
  runningTime: "",
  class: "",
};

const concertInfoReducer = (
  state: ConcertInfoState = initialState,
  action: ConcertInfoAction,
): ConcertInfoState => {
  switch (action.type) {
    case CHANGE_SELECTED_CONCERT:
      return {
        ...state,
        id: action.payload.id,
        name: action.payload.name,
      };
    case SELECT_SCHEDULE:
      return {
        ...state,
        scheduleId: action.payload.id,
        dateDetail: action.payload.dateDetail,
      };
    case SET_CLASS_INFO:
      return {
        ...state,
        prices: { ...action.payload.prices },
        colors: { ...action.payload.colors },
      };
    default:
      return state;
  }
};

export default concertInfoReducer;

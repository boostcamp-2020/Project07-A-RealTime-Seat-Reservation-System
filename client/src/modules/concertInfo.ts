const CHANGE_SELECTED_CONCERT = "concertInfo/CHANGE_SELECTED_CONCERT" as const;
const SELECT_SCHEDULE = "concertInfo/SELECT_SCHEDULE" as const;

export const changeSelectedConcert = (id: string) => ({
  type: CHANGE_SELECTED_CONCERT,
  payload: id,
});

export const selectSchedule = (id: string) => ({
  type: SELECT_SCHEDULE,
  payload: id,
});

export interface ConcertInfo {
  id: string;
  name: string;
  scheduleId?: string;
  date?: string;
  price?: string;
  startDate?: string;
  endDate?: string;
  runningTime?: string;
  class?: string;
}

type ConcertInfoAction =
  | ReturnType<typeof changeSelectedConcert>
  | ReturnType<typeof selectSchedule>;

type ConcertInfoState = ConcertInfo;

const initialState: ConcertInfoState = {
  id: "",
  name: "",
  scheduleId: undefined,
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
        scheduleId: action.payload,
      };
    default:
      return state;
  }
};

export default concertInfoReducer;

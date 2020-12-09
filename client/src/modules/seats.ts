import { SeatInfo } from "../types/seatInfo";
const INCREASE_SEAT = "seats/INCREASE_SEAT" as const;
const DECREASE_SEAT = "seats/DECREASE_SEAT" as const;
const SELECT_SEAT = "seats/SELECT_SEAT" as const;
const CANCEL_SEAT = "seats/CANCEL_SEAT" as const;
const INIT_SEAT = "seats/INIT_SEAT" as const;
// TODO: 해당 회차 공연 정보 가져오는 action추가?
interface SeatCount {
  name: string;
  color: string;
  count: number;
  price: number;
}

export const increaseSeat = (seatName: string) => ({
  type: INCREASE_SEAT,
  payload: seatName,
});
export const decreaseSeat = (seatName: string) => ({
  type: DECREASE_SEAT,
  payload: seatName,
});
export const selectSeat = (seat: SeatInfo) => ({
  type: SELECT_SEAT,
  payload: seat,
});
export const cancelSeat = (id: string) => ({
  type: CANCEL_SEAT,
  payload: id,
});
export const initSeat = () => ({
  type: INIT_SEAT,
});

type SeatsAction =
  | ReturnType<typeof increaseSeat>
  | ReturnType<typeof decreaseSeat>
  | ReturnType<typeof selectSeat>
  | ReturnType<typeof cancelSeat>
  | ReturnType<typeof initSeat>;

export interface Seat {
  selectedSeat: Array<SeatInfo>;
  seatCount: Array<SeatCount>;
}

type SeatState = Seat;

const initialState: SeatState = {
  selectedSeat: [],
  seatCount: [],
};

const seatsReducer = (state: SeatState = initialState, action: SeatsAction): SeatState => {
  switch (action.type) {
    case INCREASE_SEAT:
      return {
        selectedSeat: state.selectedSeat.map((seat) => seat),
        seatCount: state.seatCount.map((seatGrade) => {
          if (action.payload === seatGrade.name) seatGrade.count++;
          return seatGrade;
        }),
      };
    case DECREASE_SEAT:
      return {
        selectedSeat: state.selectedSeat.map((seat) => seat),
        seatCount: state.seatCount.map((seatGrade) => {
          if (action.payload === seatGrade.name) seatGrade.count--;
          return seatGrade;
        }),
      };
    case SELECT_SEAT:
      return {
        selectedSeat: [...state.selectedSeat, action.payload],
        seatCount: state.seatCount.map((seatGrade) => seatGrade),
      };
    case CANCEL_SEAT:
      return {
        selectedSeat: state.selectedSeat.filter((seat) => seat.id !== action.payload),
        seatCount: state.seatCount.map((seatGrade) => seatGrade),
      };
    case INIT_SEAT:
      return {
        selectedSeat: [],
        seatCount: [...state.seatCount],
      };
    default:
      return state;
  }
};

export default seatsReducer;

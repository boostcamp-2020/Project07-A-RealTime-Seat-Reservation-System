const INCREASE_SEAT = "seats/INCREASE_SEAT" as const;
const DECREASE_SEAT = "seats/DECREASE_SEAT" as const;
const SELECT_SEAT = "seats/SELECT_SEAT" as const;
const CANCEL_SEAT = "seats/CANCEL_SEAT" as const;

interface SeatInfo {
  id: number;
  color: string;
  floor?: number;
  area?: string;
  row: string;
  num: number;
}

interface SeatCount {
  name: string;
  color: string;
  count: number;
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
export const cancelSeat = (id: number) => ({
  type: CANCEL_SEAT,
  payload: id,
});

type SeatsAction =
  | ReturnType<typeof increaseSeat>
  | ReturnType<typeof decreaseSeat>
  | ReturnType<typeof selectSeat>
  | ReturnType<typeof cancelSeat>;

export interface Seat {
  selectedSeat: Array<SeatInfo>;
  seatCount: Array<SeatCount>;
}

type SeatState = Seat;

const initialState: SeatState = {
  selectedSeat: [
    { id: 0, color: "#6c5ce7", floor: 1, row: "9", num: 8 },
    { id: 1, color: "#6c5ce7", floor: 1, row: "9", num: 9 },
    { id: 2, color: "#6c5ce7", floor: 1, row: "9", num: 10 },
    { id: 3, color: "#6c5ce7", floor: 1, row: "9", num: 11 },
    { id: 4, color: "#6c5ce7", floor: 1, row: "9", num: 12 },
    { id: 5, color: "#6c5ce7", floor: 1, row: "9", num: 13 },
  ],
  seatCount: [
    { color: "#6c5ce7", name: "VIP석", count: 2 },
    { color: "#74b9ff", name: "R석", count: 0 },
    { color: "#e17055", name: "S석", count: 5 },
  ],
};

const seatsReducer = (
  state: SeatState = initialState,
  action: SeatsAction
): SeatState => {
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
        selectedSeat: state.selectedSeat.concat(action.payload),
        seatCount: state.seatCount.map((seatGrade) => seatGrade),
      };
    case CANCEL_SEAT:
      return {
        selectedSeat: state.selectedSeat.filter(
          (seat) => seat.id !== action.payload
        ),
        seatCount: state.seatCount.map((seatGrade) => seatGrade),
      };
    default:
      return state;
  }
};

export default seatsReducer;

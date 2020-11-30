const INCREASE_SEAT = "seats/INCREASE_SEAT" as const;
const DECREASE_SEAT = "seats/DECREASE_SEAT" as const;
const SELECT_SEAT = "seats/SELECT_SEAT" as const;
const CANCEL_SEAT = "seats/CANCEL_SEAT" as const;
const INIT_SERVER_SEAT = "seats/INIT_SERVER_SEAT" as const;
// TODO: 해당 회차 공연 정보 가져오는 action추가?
interface SeatInfo {
  id: string;
  color: string;
  name: string;
  point: object;
  status: string;
}

interface SeatCount {
  name: string;
  color: string;
  count: number;
  price?: string;
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

type SeatsAction =
  | ReturnType<typeof increaseSeat>
  | ReturnType<typeof decreaseSeat>
  | ReturnType<typeof selectSeat>
  | ReturnType<typeof cancelSeat>

export interface Seat {
  selectedSeat: Array<SeatInfo>;
  seatCount: Array<SeatCount>;
}

type SeatState = Seat;

const initialState: SeatState = {
  selectedSeat: [],
  seatCount: [
    { color: "#6c5ce7", name: "VIP석", count: 2, price: "140,000" },
    { color: "#74b9ff", name: "R석", count: 0, price: "120,000" },
    { color: "#e17055", name: "S석", count: 5, price: "100,000" },
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
        selectedSeat: [...state.selectedSeat, action.payload],
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

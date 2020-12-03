import { SeatInfo, EmptySeatCount } from "../types/seatInfo";

interface ReducerData {
  type: string;
  payload: { seats: SeatInfo[]; counts: EmptySeatCount[] };
}

export const seatReducer = (serverSeats: any, data: ReducerData) => {
  switch (data.type) {
    case "SET_DATA":
      return {
        seats: [...data.payload.seats],
        counts: { ...data.payload.counts },
      };
    default:
      return serverSeats;
  }
};

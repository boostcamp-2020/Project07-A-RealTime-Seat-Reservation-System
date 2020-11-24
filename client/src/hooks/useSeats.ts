import { useSelector } from "react-redux";
import { RootState } from "../modules";

export default function useSeats() {
  const seats = useSelector((state: RootState) => state.seatsReducer);
  return seats;
}

import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { selectSeat } from "../modules/seats";

export default function useSelectSeat() {
  const dispatch = useDispatch();
  return useCallback((seat) => dispatch(selectSeat(seat)), [dispatch]);
}

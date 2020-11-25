import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { cancelSeat } from "../modules/seats";

export default function useCancelSeat() {
  const dispatch = useDispatch();
  return useCallback((id) => dispatch(cancelSeat(id)), [dispatch]);
}

import { useSelector } from "react-redux";
import { RootState } from "../modules";

export default function useSocket() {
  const socket = useSelector((state: RootState) => state.socketReducer);
  return socket;
}

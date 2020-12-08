import { useSelector } from "react-redux";
import { RootState } from "../modules";

export default function useConcertInfo() {
  const concertInfo = useSelector((state: RootState) => state.concertInfoReducer);
  return concertInfo;
}

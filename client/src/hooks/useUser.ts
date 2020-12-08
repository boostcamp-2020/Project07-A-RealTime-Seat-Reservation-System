import { useSelector } from "react-redux";
import { RootState } from "../modules";

export default function useUser() {
  const user = useSelector((state: RootState) => state.userReducer);
  return user;
}

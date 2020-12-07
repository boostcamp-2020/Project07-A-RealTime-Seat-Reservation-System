import { useSelector } from "react-redux";
import { RootState } from "../modules";

export default function useItems() {
  const items = useSelector((state: RootState) => state.itemsReducer);

  return items;
}

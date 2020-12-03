import React, { useReducer, useEffect } from "react";
import { seatReducer } from "../reducers/seatReducer";
import { socket } from "../socket";
import { SeatInfo, EmptySeatCount } from "../types/seatInfo";

export const SeatContext = React.createContext<any>(null);
export const CountContext = React.createContext<any>(null);

export function SeatStore({ children }: { children: React.ReactNode }) {
  const [serverSeats, dispatch] = useReducer(seatReducer, {
    seats: [],
    counts: [],
  });

  const setServerSeats = (seats: any) => {
    dispatch({ type: "SET_DATA", payload: seats });
  };

  useEffect(() => {
    socket.on(
      "receiveData",
      (seatData: { seats: SeatInfo[]; counts: EmptySeatCount[] }) => {
        setServerSeats(seatData);
      }
    );
  }, []);

  return (
    <SeatContext.Provider value={{ serverSeats, setServerSeats }}>
      {children}
    </SeatContext.Provider>
  );
}

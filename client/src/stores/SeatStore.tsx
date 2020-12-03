import React, { useReducer, useEffect } from "react";
import { seatReducer } from "../reducers/seatReducer";
import { socket } from "../socket";
import { SeatInfo, EmptySeatCount } from "../types/seatInfo";

export const SeatContext = React.createContext<any>(null);
export const CountContext = React.createContext<any>(null);

export function SeatStore({ children }: { children: React.ReactNode }) {
  const [serverSeats, dispatch] = useReducer(seatReducer, {
    seats: [],
    counts: {},
  });

  const setServerSeats = (seats: any) => {
    dispatch({ type: "SET_DATA", payload: seats });
  };

  useEffect(() => {
    socket.on(
      "receiveSeat",
      (seatData: { seats: SeatInfo[]; counts: EmptySeatCount[] }) => {
        console.log(seatData);
        setServerSeats(seatData);
      }
    );
    socket.on("receiveCount", (seatData: { counts: Object[] }) => {
      console.log(seatData);
      console.log({ ...serverSeats, counts: seatData.counts[0] });
      setServerSeats({ ...serverSeats, counts: seatData.counts[0] });
    });
  }, []);

  return (
    <SeatContext.Provider value={{ serverSeats, setServerSeats }}>
      {children}
    </SeatContext.Provider>
  );
}

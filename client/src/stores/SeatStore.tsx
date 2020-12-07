import React, { useReducer, useEffect } from "react";
import { seatReducer } from "../reducers/seatReducer";
import { socket } from "../socket";
import { SeatInfo } from "../types/seatInfo";

export const SeatContext = React.createContext<any>(null);

export function SeatStore({ children }: { children: React.ReactNode }) {
  const [serverSeats, dispatch] = useReducer(seatReducer, {
    seats: [],
    counts: {},
  });

  const setServerSeats = (seats: any) => {
    dispatch({ type: "SET_DATA", payload: seats });
  };

  useEffect(() => {
    let seats: any[] = [];
    let counts = {};
    socket.on("receiveSeat", (seatData: { seats: SeatInfo[] }) => {
      seats = [...seatData.seats];
      setServerSeats({ counts: { ...counts }, seats: seatData.seats });
    });
    socket.on("receiveCount", (seatData: { counts: Object[] }) => {
      counts = { ...seatData.counts[0] };
      setServerSeats({ seats: [...seats], counts: seatData.counts[0] });
    });
  }, []);

  return (
    <SeatContext.Provider value={{ serverSeats, setServerSeats }}>
      {children}
    </SeatContext.Provider>
  );
}

import React , {useReducer, useEffect} from 'react';
import {seatReducer} from "../reducers/seatReducer";
import {socket} from "../socket";


export const SeatContext = React.createContext<any>(null);

export function SeatStore({ children }: { children: React.ReactNode }) {
    const [serverSeats, dispatch] = useReducer(seatReducer, [])

    const setServerSeats = (seats:any) => {
        dispatch({type: "SET_DATA", payload: seats})
    }

    useEffect(()=> {
            socket.on("receiveData",(seatData: any ) => {
                setServerSeats(seatData.seats);
            });
    },[])

    

    return (
        <SeatContext.Provider value={{serverSeats, setServerSeats}}>
            {children}
        </SeatContext.Provider>
    );
}
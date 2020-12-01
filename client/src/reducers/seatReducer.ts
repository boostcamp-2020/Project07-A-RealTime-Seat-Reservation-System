import {SeatInfo} from "../types/seatInfo"

interface ReducerData {
    type: string,
    payload: SeatInfo[]
}

export const seatReducer = (serverSeats:any, data:ReducerData) => {
    switch(data.type) {
        case "SET_DATA" : 
            return [...data.payload];
        default :
            return serverSeats;

    }
}
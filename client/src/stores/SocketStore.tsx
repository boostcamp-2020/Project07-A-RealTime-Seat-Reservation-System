import React, { useState, useEffect, useReducer } from "react";
import SocketWorker from "../worker/WebWorker";

const socketWorker = SocketWorker;

export const SocketContext = React.createContext<any>(null);

export const socketReducer = (data: any, action: { type: string; payload: any }) => {
  switch (action.type) {
    case "INIT_REALTIME_SEATS":
      return {
        realTimeSeats: [],
        realTimeCounts: { ...data.realTimeCounts },
        selectedSeats: [...data.selectedSeats],
      };

    case "SET_REALTIME_SEATS":
      return {
        realTimeSeats: [...action.payload],
        realTimeCounts: { ...data.realTimeCounts },
        selectedSeats: [...data.selectedSeats],
      };

    case "SET_REALTIME_COUNTS":
      return {
        realTimeSeats: [...data.realTimeSeats],
        realTimeCounts: { ...action.payload },
        selectedSeats: [...data.selectedSeats],
      };

    case "INIT_SEATS":
      return {
        realTimeSeats: [...data.realTimeSeats],
        realTimeCounts: { ...data.realTimeCounts },
        selectedSeats: [],
      };

    case "ADD_SEATS":
      return {
        realTimeSeats: [...data.realTimeSeats],
        realTimeCounts: { ...data.realTimeCounts },
        selectedSeats: [...data.selectedSeats, action.payload],
      };

    case "DELETE_SEATS":
      return {
        realTimeSeats: [...data.realTimeSeats],
        realTimeCounts: { ...data.realTimeCounts },
        selectedSeats: [...data.selectedSeats.filter((seat: any) => seat._id !== action.payload)],
      };

    default:
      return data;
  }
};

export const SocketStore: React.FC = ({ children }) => {
  const [socketData, dispatch] = useReducer(socketReducer, {
    realTimeSeats: [],
    realTimeCounts: {},
    selectedSeats: [],
  });

  useEffect(() => {
    socketWorker.onmessage = function (message) {
      const { type, data } = message.data;
      if (type === "seats") {
        dispatch({ type: "SET_REALTIME_SEATS", payload: data });
      }
      if (type === "counts") {
        dispatch({ type: "SET_REALTIME_COUNTS", payload: data });
      }
      if (type === "expire") {
        dispatch({ type: "DELETE_SEATS", payload: data });
      }
    };
  }, []);

  const initRealTimeSeats = () => {
    dispatch({ type: "INIT_REALTIME_SEATS", payload: undefined });
  };

  const initSeats = () => {
    dispatch({ type: "INIT_SEATS", payload: undefined });
  };

  const selectSeat = (data: any) => {
    dispatch({ type: "ADD_SEATS", payload: data });
  };

  const cancelSeat = (id: any) => {
    dispatch({ type: "DELETE_SEATS", payload: id });
  };

  return (
    <SocketContext.Provider
      value={{
        socketData,
        selectSeat,
        cancelSeat,
        initSeats,
        initRealTimeSeats,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

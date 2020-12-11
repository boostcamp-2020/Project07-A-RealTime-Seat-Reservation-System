import React, { useState, useEffect, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { useQuery, gql } from "@apollo/client";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { colors } from "../../styles/variables";
import { socket } from "../../socket";

const useStyles = makeStyles(() => ({}));

export default function BookingCancelArea() {
  const [userName, setUserName] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const [booking, setBooking] = useState<any>();
  const location = useLocation();

  useEffect(() => {
    socket.emit("willCancelBooking", booking.schedule._id, booking.seats);
  }, []);
  return <></>;
}

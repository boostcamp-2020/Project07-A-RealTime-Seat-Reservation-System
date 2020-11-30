import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { makeStyles } from "@material-ui/core/styles";
import { differenceInCalendarDays } from "date-fns";
import { colors } from "../../../styles/variables";
import Box from "@material-ui/core/Box";
import DateRangeIcon from "@material-ui/icons/DateRange";
import { EmptySeatsCount } from "../../common";

const date = new Date();

const disabledDates = [
  new Date("2020-12-01"),
  new Date("2020-12-04"),
  new Date("2020-12-11"),
];
const concertTmpList = [
  { id: 0, year: 2020, month: 12, date: 5, hour: 17, minute: 0 },
  { id: 1, year: 2020, month: 12, date: 5, hour: 20, minute: 30 },
  { id: 2, year: 2020, month: 12, date: 6, hour: 8, minute: 0 },
  { id: 3, year: 2020, month: 12, date: 7, hour: 2, minute: 0 },
  { id: 4, year: 2020, month: 12, date: 7, hour: 5, minute: 30 },
  { id: 5, year: 2020, month: 12, date: 7, hour: 9, minute: 0 },
  { id: 6, year: 2020, month: 12, date: 8, hour: 5, minute: 30 },
];
// const muiTheme = createMuiTheme({
//   palette: { primary: colors.naverWhite, secondary: colors.naverBlue },
// });
const useStyles = makeStyles(() => ({
  calendar: {
    width: "100%",
    border: "1px none",
  },
  selectHeader: {
    display: "flex",
    alignItems: "center",
    margin: "0.5rem 19px",
    paddingBottom: "9px",
    borderBottom: `1px solid ${colors.naverFontBlack}`,
  },
  selectIcon: {
    marginTop: "3px",
    marginRight: "4px",
  },
  selectTitle: {
    margin: "0",
    fontSize: "20px",
    lineHeight: "1.5",
    color: `${colors.naverFontBlack}`,
    letterSpacing: "-1px",
  },
  scheduleTime: {
    margin: "-1px 19px 0",
    borderTop: `1px solid ${colors.borderLightGray2}`,
  },
  scheduleTitle: {
    marginBottom: "10px",
    marginBlockStart: "1rem",
    fontSize: "16px",
    fontWeight: "normal",
    color: `${colors.naverFontBlack}`,
  },
  timeBox: {
    display: "flex",
    overflow: "visible",
    height: "auto",
    margin: "0 -5px",
  },
  timeItem: {
    width: "33.3333%",
    height: "57px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "9px",
    margin: "0 5px",
    background: `${colors.naverWhite}`,
    border: `1px solid ${colors.borderGray2}`,
    borderRadius: "3px",
    fontSize: "14px",
    color: "#424242",
    cursor: "pointer",
    "&:hover": {
      border: `1px solid ${colors.naverBlue}`,
      color: `${colors.naverBlue}`,
    },
  },
  selectedItem: {
    border: `1px solid ${colors.naverBlue}`,
    backgroundColor: `${colors.naverBlue}`,
  },
  timeItemTitle: {
    fontWeight: "bold",
  },
}));

const tileDisabled = ({ date, view }) => {
  if (view === "month") {
    return disabledDates.find((dDate) => isSameDay(dDate, date));
  }
};

const isSameDay = (a, b) => {
  return differenceInCalendarDays(a, b) === 0;
};

export default function CalendarPicker({ setTimeDetail }) {
  const [value, setValue] = useState();
  const [concertList, setConcertList] = useState([]);
  const [selectedConcertId, setSelectedConcertId] = useState();
  const classes = useStyles();

  const handleOnChange = (value) => {
    if (value) {
      setTimeDetail({
        year: value.getFullYear(),
        month: value.getMonth(),
        date: value.getDate(),
      });
      setConcertList(
        concertTmpList.filter(
          (concert) =>
            concert.year === value.getFullYear() &&
            concert.month === value.getMonth() + 1 &&
            concert.date === value.getDate()
        )
      );
      console.log(value.getMonth());
    }
    setValue(value);
  };

  const handleOnClick = (e) => {
    setSelectedConcertId(e.target.id);
    console.log(selectedConcertId);
  };

  return (
    <>
      <Box className={classes.selectHeader}>
        <DateRangeIcon className={classes.selectIcon} />
        <h3 className={classes.selectTitle}>일정을 선택하세요</h3>
      </Box>
      <Calendar
        onChange={handleOnChange}
        className={classes.calendar}
        value={value}
        tileDisabled={tileDisabled}
        minDate={new Date()}
        maxDate={new Date("2021-02-07")}
        next2Label={null}
        prev2Label={null}
      />
      {concertList.length ? (
        <Box className={classes.scheduleTime}>
          <h4 className={classes.scheduleTitle}>회차를 선택하세요.</h4>
          <Box className={classes.timeBox}>
            {concertList.map((concert) => (
              <Box
                key={concert.id}
                id={concert.id}
                className={classes.timeItem}
                onClick={handleOnClick}
              >
                {concert.hour >= 12 ? (
                  <span
                    className={classes.timeItemTitle}
                    id={concert.id}
                    onClick={handleOnClick}
                  >
                    오후 {concert.hour - 12}:{("0" + concert.minute).slice(-2)}
                  </span>
                ) : (
                  <span
                    className={classes.timeItemTitle}
                    id={concert.id}
                    onClick={handleOnClick}
                  >
                    오전 {concert.hour}:{("0" + concert.minute).slice(-2)}
                  </span>
                )}
              </Box>
            ))}
          </Box>
          {selectedConcertId ? <EmptySeatsCount /> : null}
        </Box>
      ) : null}
    </>
  );
}

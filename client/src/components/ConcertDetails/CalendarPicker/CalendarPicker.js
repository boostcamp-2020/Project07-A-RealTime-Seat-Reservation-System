import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { makeStyles, styled } from "@material-ui/core/styles";
import { differenceInCalendarDays, format } from "date-fns";
import { colors } from "../../../styles/variables";
import { Box, Button } from "@material-ui/core";
import DateRangeIcon from "@material-ui/icons/DateRange";
import { EmptySeatsCount } from "../../common";
import { useHistory } from "react-router-dom";
import { ko } from "date-fns/locale";

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
  selectedItem: {
    border: `1px solid ${colors.naverBlue}`,
    backgroundColor: `${colors.naverBlue}`,
  },
  timeItemTitle: {
    fontWeight: "bold",
  },
  btnArea: {
    padding: "0 12px",
  },
}));

const TimeBox = styled(Box)((props) => ({
  width: "33.3333%",
  height: "57px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "9px",
  margin: "0 5px",
  backgroundColor: props.color,
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
}));

const SelectSeatBtn = styled(Button)((props) => ({
  width: "100%",
  padding: "0",
  margin: "8px 0",
  backgroundColor: props.backgroundcolor,
  borderRadius: "5px",
  fontSize: "18px",
  fontWeight: "bold",
  color: colors.naverWhite,
  lineHeight: "52px",
  "&:hover": {
    backgroundColor: props.backgroundcolor,
  },
}));

const tileDisabled = ({ date, view }) => {
  if (view === "month") {
    return disabledDates.find(dDate => isSameDay(dDate, date));
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
  const history = useHistory();

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
  // TODO: 해당 시간 클릭하면 그 box만 색칠하기.(다른 시간이 선택되어있었으면 그 box 다시 흰색으로 바꾸기)
  const handleOnClick = (e) => {
    setSelectedConcertId(e.target.id);
    console.log(selectedConcertId);
  };

  const handleOnClickBtn = () => {
    const selectSeatLink = "/seat";
    history.push({
      pathname: selectSeatLink,
      state: {
        selectedConcertId,
      },
    });
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
              <TimeBox
                key={concert.id}
                id={concert.id}
                onClick={handleOnClick}
                color={
                  concert.id === selectedConcertId
                    ? colors.naverBlue
                    : colors.naverWhite
                }
              >
                <span
                  className={classes.timeItemTitle}
                  id={concert.id}
                  onClick={handleOnClick}
                >
                  {format(
                    new Date(0, 0, 0, concert.hour, concert.minute),
                    "a H:mm",
                    { locale: ko }
                  )}
                </span>
              </TimeBox>
            ))}
          </Box>
          {selectedConcertId ? <EmptySeatsCount /> : null}
        </Box>
      ) : null}
      <Box className={classes.btnArea}>
        {selectedConcertId ? (
          <SelectSeatBtn
            onClick={handleOnClickBtn}
            backgroundcolor={colors.naverBtnGreen}
          >
            좌석 선택하기
          </SelectSeatBtn>
        ) : (
          <SelectSeatBtn backgroundcolor={colors.naverBtnDisabled} disabled>
            좌석 선택하기
          </SelectSeatBtn>
        )}
      </Box>
    </>
  );
}

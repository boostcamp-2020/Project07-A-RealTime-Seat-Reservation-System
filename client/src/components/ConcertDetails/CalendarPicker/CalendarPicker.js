import React, { useState, useRef, useEffect } from "react";
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
import { useQuery, gql } from "@apollo/client";
import { DnsTwoTone } from "@material-ui/icons";
import { socket } from "../../../socket";
import useConcertInfo from "../../../hooks/useConcertInfo";
import { useDispatch } from "react-redux";
import { selectSchedule } from "../../../modules/concertInfo";

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
  color: props.fontcolor,
  cursor: "pointer",
  "&:hover": {
    border: `1px solid ${colors.naverBlue}`,
    color: props.hoverfontcolor,
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

const isSameDay = (a, b) => {
  return differenceInCalendarDays(a, b) === 0;
};

const GET_SCHGEDULE = gql`
  query GetItem($id: ID) {
    scheduleListByMonth(itemId: $id, startDate: "2020-12-1", endDate: "2021-02-01") {
      _id
      date
    }

    itemDetail(itemId: $id) {
      startDate
      endDate
    }
  }
`;

const MILESCONT_PER_DAY = 1000 * 60 * 60 * 24;

export default function CalendarPicker({ setTimeDetail }) {
  const [value, setValue] = useState();
  const [concertList, setConcertList] = useState([]);
  const [selectedConcertId, setSelectedConcertId] = useState();
  const classes = useStyles();
  const history = useHistory();
  const concertInfo = useConcertInfo();
  const dispatch = useDispatch();

  //스케쥴 관련 API 호출
  const { loading, error, data } = useQuery(GET_SCHGEDULE, {
    variables: { id: concertInfo.id },
  });

  if (loading) return <p> loading.... </p>;

  const startDate = new Date(data.itemDetail.startDate);
  const endDate = new Date(data.itemDetail.endDate);

  //서버에서 날라온 데이터를 오브젝트에 형식에 맞게 변경
  const scheduleList = data.scheduleListByMonth.map((concert) => {
    const date = new Date(concert.date);
    return {
      id: concert._id,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      date: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
    };
  });

  //비활성화 해야하는 날짜들을 선별
  const getDisableList = () => {
    const scheduleMap = scheduleList.reduce((map, concert) => {
      map[new Date(`${concert.year}-${concert.month}-${concert.date}`).getTime()] = concert;
      return map;
    }, {});

    const startMilesecond = new Date(
      `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`,
    ).getTime();
    const endMilesecond = new Date(
      `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`,
    ).getTime();
    let disableList = [];
    for (let i = startMilesecond; i <= endMilesecond; i += MILESCONT_PER_DAY) {
      if (!scheduleMap[i]) disableList = [...disableList, new Date(i)];
    }
    return disableList;
  };

  const tileDisabled = ({ date, view }) => {
    if (view === "month") {
      return getDisableList().find((dDate) => isSameDay(dDate, date));
    }
  };

  const handleOnChange = (value) => {
    if (value) {
      setTimeDetail({
        year: value.getFullYear(),
        month: value.getMonth(),
        date: value.getDate(),
      });
      setConcertList(
        scheduleList.filter((concert) => {
          return (
            concert.year === value.getFullYear() &&
            concert.month === value.getMonth() + 1 &&
            concert.date === value.getDate()
          );
        }),
      );
    }
    setValue(value);
  };
  // TODO: 해당 시간 클릭하면 그 box만 색칠하기.(다른 시간이 선택되어있었으면 그 box 다시 흰색으로 바꾸기)
  const handleOnClick = (e) => {
    setSelectedConcertId(e.target.id);
    dispatch(selectSchedule(e.target.id));
    //socket.emit("leaveCountRoom", scheduleID);
    socket.emit("joinCountRoom", "A");
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

  //minDate는 최소 날짜 maxDate는 최고 날짜가 보이는 듯
  //tileDisabled는 비활성화 되어야 하는 날짜가 배열로 들어가야함
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
        minDate={startDate}
        maxDate={endDate}
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
                color={concert.id === selectedConcertId ? colors.naverBlue : colors.naverWhite}
                fontcolor={
                  concert.id === selectedConcertId ? colors.naverWhite : colors.naverFontBlack
                }
                hoverfontcolor={
                  concert.id === selectedConcertId ? colors.naverWhite : colors.naverBlue
                }
              >
                <span className={classes.timeItemTitle} id={concert.id} onClick={handleOnClick}>
                  {format(new Date(0, 0, 0, concert.hour, concert.minute), "a h:mm", {
                    locale: ko,
                  })}
                </span>
              </TimeBox>
            ))}
          </Box>
          {selectedConcertId ? <EmptySeatsCount /> : null}
        </Box>
      ) : null}
      <Box className={classes.btnArea}>
        {selectedConcertId ? (
          <SelectSeatBtn onClick={handleOnClickBtn} backgroundcolor={colors.naverBtnGreen}>
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

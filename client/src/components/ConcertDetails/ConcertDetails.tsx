import React, { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import {
  makeStyles,
  Theme,
  useTheme,
  withStyles,
} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import { colors } from "../../styles/variables";
import CalendarPicker from "./CalendarPicker/CalendarPicker";
//import CalendarPicker from "./CalendarPicker/CalendarPicker.js";
import { useQuery, gql } from "@apollo/client";

const GET_ITEMS = gql`
  {
    itemDetail(itemId: "5fc50ac37ac124455f4f2d04") {
      name
    }
  }
`;

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

const CustomTabs = withStyles({
  indicator: {
    backgroundColor: `${colors.naverFontBlack}`,
  },
})(Tabs);

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={1}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: `${colors.naverWhite}`,
  },
  tab: {
    backgroundColor: "#f4f3f3",
  },
  tabBtn: {
    minWidth: "33%",
    fontWeight: "bold",
    color: `${colors.naverFontBlack}`,
  },
}));

export default function ConcertDetails() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const date = new Date();
  const [timeDetail, setTimeDetail] = useState({
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDate(),
    hour: undefined,
    minute: undefined,
  });

  const { loading, error, data } = useQuery(GET_ITEMS);

  console.log(loading, error, data);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <CustomTabs value={value} onChange={handleChange}>
          <Tab className={classes.tabBtn} label="예매하기" {...a11yProps(0)} />
          <Tab className={classes.tabBtn} label="상세정보" {...a11yProps(1)} />
          <Tab
            className={classes.tabBtn}
            label="리뷰(구현X)"
            {...a11yProps(2)}
          />
        </CustomTabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <CalendarPicker setTimeDetail={setTimeDetail} />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          Item Three
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}

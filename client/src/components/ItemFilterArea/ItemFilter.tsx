import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Tab } from "@material-ui/core";
import { TabPanel, TabList, TabContext } from "@material-ui/lab";

interface ItemFilterPropsInterface {
  genre: string;
  setGenre: any;
  genres: Array<string>;
}
const useStyles = makeStyles(() => ({
  tabList: {
    backgroundColor: "#89bb6d",
  },

  indicator: {
    backgroundColor: "transparent",
    "& > span": {
      backgroundColor: "transparent",
    },
  },

  tab: {
    minWidth: "6rem",
    maxWidth: "6rem",
    color: "#fff",
    opacity: 0.5,

    "&$selected": {
      color: "#fff",
      opacity: 1,
    },
  },
}));

function ItemFilter({ genre, setGenre, genres }: ItemFilterPropsInterface) {
  const tabStyle = useStyles();

  const handleChange = (event: any, newValue: string) => {
    setGenre(newValue);
  };

  const tabList = genres.map((genreName: string) => {
    return <Tab key={genreName} label={genreName} value={genreName} className={tabStyle.tab}></Tab>;
  });

  return (
    <>
      <TabContext value={genre}>
        <TabList
          className={tabStyle.tabList}
          onChange={handleChange}
          centered
          classes={{ indicator: tabStyle.indicator }}
        >
          {tabList}
        </TabList>
      </TabContext>
    </>
  );
}

export default ItemFilter;

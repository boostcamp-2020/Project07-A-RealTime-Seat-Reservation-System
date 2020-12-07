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
  root: {},

  tabList: {
    backgroundColor: "#FFFFFF",
  },
}));

function ItemFilter({ genre, setGenre, genres }: ItemFilterPropsInterface) {
  const tabStyle = useStyles();

  const handleChange = (event: any, newValue: string) => {
    setGenre(newValue);
  };

  const tabList = genres.map((genreName: string) => {
    return <Tab key={genreName} label={genreName} value={genreName}></Tab>;
  });

  return (
    <div className={tabStyle.root}>
      <TabContext value={genre}>
        <TabList
          className={tabStyle.tabList}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          {tabList}
        </TabList>
      </TabContext>
    </div>
  );
}

export default ItemFilter;

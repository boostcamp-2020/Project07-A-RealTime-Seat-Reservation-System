import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Tab } from "@material-ui/core";
import { TabPanel, TabList, TabContext } from "@material-ui/lab";

interface FilterProps {
  filterList: Array<string>;
}
const useStyles = makeStyles(() => ({
  root: {},

  tabList: {
    backgroundColor: "#FFFFFF",
  },
}));

function ItemFilter({ filterList }: FilterProps) {
  const [value, setValue] = useState("1");
  const tabStyle = useStyles();

  const handleChange = (event: any, newValue: string) => {
    setValue(newValue);
  };

  const tabList = filterList.map((filterName, idx) => {
    return <Tab label={filterName} value={(idx + 1).toString()}></Tab>;
  });

  return (
    <div className={tabStyle.root}>
      <TabContext value={value}>
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

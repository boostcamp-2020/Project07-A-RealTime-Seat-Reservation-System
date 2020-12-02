import React, { useState } from "react";
import { Paper, Button } from "@material-ui/core";
import {
  useStaticState,
  Calendar,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

export default function CalendarPicker() {
  const [value, handleDateChange] = useState(new Date());

  // you can past mostly all available props, like minDate, maxDate, autoOk and so on
  const { pickerProps, wrapperProps } = useStaticState({
    value,
    onChange: handleDateChange,
  });

  return (
    <>
      <div>
        <Paper style={{ overflow: "hidden" }}>
          <Calendar {...pickerProps} />
        </Paper>
        <Button fullWidth onClick={wrapperProps.onClear}>
          Clear date ({value && value.toJSON()})
        </Button>
      </div>
    </>
  );
}

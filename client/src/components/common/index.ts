import { styled } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { colors } from "../../styles/variables";
import Box from "@material-ui/core/Box";

interface styleProps {
  color: string;
}

export { default as EmptySeatsCount } from "./EmptySeatsCount/EmptySeatsCount";
export { default as StepButton } from "./StepButton/StepButton";

export const Badge = styled(Box)((props: styleProps) => ({
  display: "inline-block",
  marginTop: "4px",
  width: "13px",
  height: "13px",
  top: "3px",
  marginRight: "0.5rem",
  backgroundColor: props.color,
}));

export const Loading = styled(CircularProgress)(() => ({
  color: colors.naverGreen,
}));

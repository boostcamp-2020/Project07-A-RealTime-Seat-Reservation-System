import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { changeSelectedConcert } from "../../modules/concertInfo";

interface ItemCardPropsInterface {
  item: any;
}
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "12rem",
    minWidth: "12rem",
  },
  media: {
    minHeight: "14rem",
    maxHeight: "14rem",
  },

  title: {
    minHeight: "4rem",
  },

  place: {
    color: "#89bb6d",
  },

  duration: {
    color: "#999",
  },
}));

export default function ItemCard({ item }: ItemCardPropsInterface) {
  const cardStyles = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(changeSelectedConcert(item._id, item.name));
    const path = "/schedule";
    history.push({
      pathname: path,
      state: {
        itemId: item._id,
      },
    });
  };

  const getDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    return `${format(startDate, "yyyy.MM.dd")}~${format(endDate, "yyyy.MM.dd")}`;
  };

  return (
    <Card className={cardStyles.root} onClick={handleClick}>
      <CardMedia className={cardStyles.media} image={item.img}></CardMedia>
      <CardContent>
        <Typography variant="subtitle1" component="p" classes={{ subtitle1: cardStyles.title }}>
          {item.name}
        </Typography>
        <Typography variant="body2" component="p" classes={{ body2: cardStyles.place }}>
          {item.place.name}
        </Typography>
        <Typography variant="body2" component="p" classes={{ body2: cardStyles.duration }}>
          {getDuration(item.startDate, item.endDate)}
        </Typography>
      </CardContent>
    </Card>
  );
}

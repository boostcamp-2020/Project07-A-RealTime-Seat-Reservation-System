import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { useDispatch } from "react-redux";
import { changeSelectedConcert } from "../../modules/concertInfo";

interface ItemCardPropsInterface {
  item: any;
}
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 150,
  },
  media: {
    height: 0,
    paddingTop: "56.25%",
  },
}));

export default function ItemCard({ item }: ItemCardPropsInterface) {
  const cardStyles = useStyles();
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(changeSelectedConcert(item._id));
  };

  return (
    <Link to={`/schedule/${item._id}`}>
      <Card className={cardStyles.root} onClick={handleClick}>
        <CardMedia className={cardStyles.media} image={item.img}></CardMedia>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {item.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {item.place.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {item.startDate}~{item.endDate}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}

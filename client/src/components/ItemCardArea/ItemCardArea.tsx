import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { useQuery, gql } from "@apollo/client";
import ItemCard from "./ItemCard";
import { Loading } from "../common";

const useStyles = makeStyles((theme) => ({
  box: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  loading: {
    width: "100%",
    padding: "100px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

interface ItemCardAreaPropsInterface {
  genre: string;
}

const GET_ITEMS = gql`
  query items($genre: String) {
    items(genre: $genre) {
      _id
      name
      startDate
      endDate
      img
      place {
        name
        location
      }
      genre
    }
  }
`;

export default function ItemCardArea({ genre }: ItemCardAreaPropsInterface) {
  const boxStyles = useStyles();
  const [items, setItems] = useState([]);

  const { loading, error, data } = useQuery(GET_ITEMS, {
    variables: { genre },
  });

  const itemMap = items.map((item, idx) => {
    return <ItemCard key={idx} item={item}></ItemCard>;
  });

  useEffect(() => {
    if (data) {
      setItems(data.items);
    }
  }, [data]);

  if (loading)
    return (
      <Box className={boxStyles.loading}>
        <Loading />
      </Box>
    );
  if (error) return <p>error...</p>;

  return <Box className={boxStyles.box}>{itemMap}</Box>;
}

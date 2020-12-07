import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { useQuery, gql } from "@apollo/client";
import ItemCard from "./ItemCard";

const useStyles = makeStyles((theme) => ({}));

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

  if (loading) return <p>loding...</p>;
  if (error) return <p>error...</p>;

  return <Box>{itemMap}</Box>;
}

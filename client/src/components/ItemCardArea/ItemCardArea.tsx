import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { useQuery, gql } from "@apollo/client";
import { setItems } from "../../modules/items";
import useItems from "../../hooks/useItems";
import { useDispatch } from "react-redux";
import ItemCard from "./ItemCard";

const useStyles = makeStyles((theme) => ({}));

const GET_ITEMS = gql`
  query {
    items {
      _id
      name
      startDate
      endDate
      img
      place {
        name
        location
      }
    }
  }
`;

export default function ItemCardArea() {
  const boxStyles = useStyles();
  const items = useItems();
  const { loading, error, data } = useQuery(GET_ITEMS);
  const dispatch = useDispatch();

  const itemMap = items.map((item, idx) => {
    return <ItemCard key={idx} item={item}></ItemCard>;
  });

  useEffect(() => {
    if (data) {
      dispatch(setItems(data.items));
    }
  }, [data]);

  if (loading) return <p>loding...</p>;
  if (error) return <p>error...</p>;

  return <Box>{itemMap}</Box>;
}

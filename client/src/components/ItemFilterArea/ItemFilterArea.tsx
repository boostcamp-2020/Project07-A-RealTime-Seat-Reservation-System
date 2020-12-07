import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery, gql } from "@apollo/client";
import ItemFilter from "./ItemFilter";

const useStyles = makeStyles(() => ({
  root: {},

  tabList: {
    backgroundColor: "#FFFFFF",
  },
}));

interface ItemFilterAreaPropsInterface {
  genre: string;
  setGenre: any;
}

const GET_GENRES = gql`
  query {
    genres {
      name
    }
  }
`;

function ItemFilterArea({ genre, setGenre }: ItemFilterAreaPropsInterface) {
  const [genres, setGenres] = useState(["전체"]);

  const { loading, error, data } = useQuery(GET_GENRES);

  useEffect(() => {
    if (data) {
      const newGenreNames = data.genres.map((genre: any) => genre.name);
      const newGenres = [...genres, ...newGenreNames];
      setGenres(newGenres);
    }
  }, [data]);

  return (
    <>
      <ItemFilter genre={genre} setGenre={setGenre} genres={genres}></ItemFilter>
    </>
  );
}

export default ItemFilterArea;

import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery, gql } from "@apollo/client";
import ItemFilter from "./ItemFilter";

const useStyles = makeStyles(() => ({
  root: {
    marginTop: "1rem",
    marginBottom: "1rem",
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
  const itemFilterAreaStyles = useStyles();

  const { loading, error, data } = useQuery(GET_GENRES);

  useEffect(() => {
    if (data) {
      const newGenreNames = data.genres.map((genre: any) => genre.name);
      const newGenres = [...genres, ...newGenreNames];
      setGenres(newGenres);
    }
  }, [data]);

  return (
    <div className={itemFilterAreaStyles.root}>
      <ItemFilter genre={genre} setGenre={setGenre} genres={genres}></ItemFilter>
    </div>
  );
}

export default ItemFilterArea;

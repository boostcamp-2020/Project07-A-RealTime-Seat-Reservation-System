import { genreModel } from "../models";

const getGenres = async () => {
  const genres = await genreModel.find({}, "name");

  return genres;
};

export default { getGenres };

import { itemModel } from "../models";

const getItemListByGenre = async (_: void, { genre }: any) => {
  const filter = genre === "전체" ? {} : { genre };
  const itemList = await itemModel
    .find(filter, "_id name startDate endDate img genre ")
    .populate("place", "name location");

  return itemList;
};

const getItemDetail = async (_: void, { itemId }: any) => {
  const item = await itemModel.findById(itemId);

  return item;
};

export default { getItemListByGenre, getItemDetail };

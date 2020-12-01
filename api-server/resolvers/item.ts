import { itemModel } from "../models";

const getItemList = async () => {
  const itemList = await itemModel
    .find({}, "_id name startDate endDate img ")
    .populate("place", "name location");

  return itemList;
};

const getItemDetail = async (_: void, { itemId }: any) => {
  const item = await itemModel.findById(itemId);

  return item;
};

export default { getItemList, getItemDetail };

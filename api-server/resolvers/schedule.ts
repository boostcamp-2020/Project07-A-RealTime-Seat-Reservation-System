import { scheduleModel } from "../models";

const getScheduleListByItemId = async (_: void, { itemId }: any) => {
  const scheduleList = await scheduleModel.find({ itemId });

  return scheduleList;
};

export default { getScheduleListByItemId };

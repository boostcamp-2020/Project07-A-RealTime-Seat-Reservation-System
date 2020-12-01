import { scheduleModel } from "../models";

const getScheduleListByMonth = async (_: void, { itemId, startDate, endDate }: any) => {
  const scheduleList = await scheduleModel.find({
    itemId,
    $and: [{ date: { $gte: new Date(startDate) } }, { date: { $lte: new Date(endDate) } }],
  });

  return scheduleList;
};

export default { getScheduleListByMonth };

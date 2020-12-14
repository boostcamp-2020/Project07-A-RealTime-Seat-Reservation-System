import { scheduleModel } from "../models";

const getScheduleListByItemId = async (_: void, { itemId }: any) => {
  const scheduleList = await scheduleModel.find({ itemId });

  return scheduleList;
};

const getSeatsByScheduleId = async (_: void, { scheduleId }: any) => {
  const seatData = (await scheduleModel.findOne({ _id: scheduleId }, "seats")) as any;

  return seatData.seats;
};

export default { getScheduleListByItemId, getSeatsByScheduleId };

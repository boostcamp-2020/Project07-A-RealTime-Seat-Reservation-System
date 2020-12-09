import { scheduleModel } from "../models";

const getScheduleListByItemId = async (_: void, { itemId }: any) => {
  const scheduleList = await scheduleModel.find({ itemId });

  return scheduleList;
};

const getSeatsByScheduleId = async (_: void, { scheduleId }: any) => {
  const seatData = await scheduleModel.findOne({ _id: scheduleId }, "seatGroups");
  const { seatGroups } = seatData as any;
  let seatArray = [] as any;

  seatGroups.forEach((element: any) => {
    seatArray = [...seatArray, ...element.seats];
  });

  return seatArray;
};

export default { getScheduleListByItemId, getSeatsByScheduleId };

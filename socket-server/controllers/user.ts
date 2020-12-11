import { userRedis, itemRedis } from "../db/redis";
import itemController from "../controllers/item";
import { getKey } from "../utils";
import { SeatDataInterface, ClassInterface, ColorInterface } from "../types";
import { Status, Key, Class, Color } from "../constants";

const setUserSeatData = async (userId: string, seatData: SeatDataInterface) => {
  if (seatData.status === Status.UNSOLD || seatData.status === Status.SOLD) {
    await userRedis.hdel(getKey(userId, Key.USER_SEATS), seatData._id);
  }
  if (seatData.status === Status.CLICKED || seatData.status === Status.CANCELING) {
    await userRedis.hset(getKey(userId, Key.USER_SEATS), seatData._id, JSON.stringify(seatData));
  }
};

const setScheduleIdOfUser = async (userId: string, scheduleId: string) => {
  await userRedis.set(getKey(userId, Key.USER_SCHEDULE), scheduleId);
};

const setUserIdOfSocket = async (socketId: string, userId: string) => {
  await userRedis.set(getKey(socketId, Key.USER_ID), userId);
};

const getUserIdOfSocket = async (userId: string) => {
  const socketId = await userRedis.get(getKey(userId, Key.USER_ID));

  return socketId;
};

const deleteUserData = async (userId: string) => {
  const scheduleId = await userRedis.get(getKey(userId, Key.USER_SCHEDULE));
  if (scheduleId === null) {
    return null;
  }
  const userSeatData = await userRedis.hgetall(getKey(userId, Key.USER_SEATS));
  const userSeats = Object.values(userSeatData).map((seat) => JSON.parse(seat));
  let newCountObj: { [key: string]: number } = {};
  const newSeatArray = userSeats.map((seat: SeatDataInterface) => {
    if (seat.status === Status.CLICKED) {
      const classObj: ClassInterface = Class;
      const colorObj: ColorInterface = Color;
      const newKey = Object.keys(classObj).find((key) => classObj[key] === seat.class);
      if (!newKey) throw Error;
      const newColor = colorObj[newKey];
      newCountObj = {
        ...newCountObj,
        [seat.class]: newCountObj[seat.class] === undefined ? 1 : newCountObj[seat.class] + 1,
      };
      return { ...seat, status: Status.UNSOLD, color: newColor };
    }
    if (seat.status === Status.CANCELING) {
      return { ...seat, status: Status.SOLD, color: Color.SOLD_SEAT };
    }
    return seat;
  });
  await Promise.all(
    newSeatArray.map((seat) =>
      itemRedis.hset(getKey(scheduleId as string, Key.SEATS), seat._id, JSON.stringify(seat)),
    ),
  );
  await Promise.all(
    Object.entries(newCountObj).map((data) => {
      return itemController.setClassCount(scheduleId as string, data[0], data[1]);
    }),
  );
  await userRedis.del(getKey(userId, Key.USER_SEATS));
  await userRedis.del(getKey(userId, Key.USER_SCHEDULE));
  return scheduleId;
};

export default {
  deleteUserData,
  setUserSeatData,
  setScheduleIdOfUser,
  setUserIdOfSocket,
  getUserIdOfSocket,
};

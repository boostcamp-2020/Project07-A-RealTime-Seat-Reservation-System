import { userRedis } from "../db/redis";
import { getKey } from "../utils";
import { SeatDataInterface } from "../types";
import { Status, Key } from "../constants";
import { itemController } from ".";

const setUserSeatData = async (userId: string, seat: SeatDataInterface) => {
  if (seat.status === Status.CLICKED)
    await userRedis.hset(getKey(userId, Key.USER_CLICKED_SEATS), seat._id, JSON.stringify(seat));

  if (seat.status === Status.CANCELING) {
    await userRedis.hset(getKey(userId, Key.USER_CANCELING_SEATS), seat._id, JSON.stringify(seat));
  }
};

const deleteUserSeatData = async (userId: string, seat: SeatDataInterface) => {
  if (seat.status === Status.CLICKED)
    await userRedis.hdel(getKey(userId, Key.USER_CLICKED_SEATS), seat._id);

  if (seat.status === Status.CANCELING) {
    await userRedis.hdel(getKey(userId, Key.USER_CANCELING_SEATS), seat._id);
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
  const scheduleId = (await userRedis.get(getKey(userId, Key.USER_SCHEDULE))) as string;
  const userClickedSeatData = await userRedis.hgetall(getKey(userId, Key.USER_CLICKED_SEATS));
  const userCancelingSeatData = await userRedis.hgetall(getKey(userId, Key.USER_CANCELING_SEATS));
  const userClickedSeats = Object.values(userClickedSeatData).map((seat) => JSON.parse(seat)) as [
    SeatDataInterface,
  ];
  const userCancelingSeats = Object.values(userCancelingSeatData).map((seat) =>
    JSON.parse(seat),
  ) as [SeatDataInterface];

  await itemController.setUnSoldSeats(userId, scheduleId, userClickedSeats);
  await itemController.setSoldSeats(userId, scheduleId, userCancelingSeats);

  await userRedis.del(getKey(userId, Key.USER_CLICKED_SEATS));
  await userRedis.del(getKey(userId, Key.USER_CANCELING_SEATS));
  await userRedis.del(getKey(userId, Key.USER_SCHEDULE));

  return scheduleId;
};

export default {
  deleteUserData,
  deleteUserSeatData,
  setUserSeatData,
  setScheduleIdOfUser,
  setUserIdOfSocket,
  getUserIdOfSocket,
};

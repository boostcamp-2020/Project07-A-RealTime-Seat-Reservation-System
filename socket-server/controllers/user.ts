import { userRedis } from "../db/redis";
import { getKey } from "../utils";
import { Key } from "../constants";
import { itemController } from ".";

const setUserSeatData = async (userId: string, seatIdArray: [string]) => {
  await Promise.all(
    seatIdArray.map((id) => {
      return userRedis.hset(getKey(userId, Key.USER_SEATS), id, id);
    }),
  );
};

const deleteUserSeatData = async (userId: string, seatIdArray: [string]) => {
  await Promise.all(
    seatIdArray.map((id) => {
      return userRedis.hdel(getKey(userId, Key.USER_SEATS), id);
    }),
  );
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

const completeUserData = async (userId: string) => {
  await userRedis.del(getKey(userId, Key.USER_SEATS));
  await userRedis.del(getKey(userId, Key.USER_SCHEDULE));
};

const deleteUserData = async (userId: string) => {
  const scheduleId = await userRedis.get(getKey(userId, Key.USER_SCHEDULE));
  if (scheduleId === null) return null;

  const userSeatData = await userRedis.hgetall(getKey(userId, Key.USER_SEATS));
  const userSeatIdArray = Object.values(userSeatData) as [string];

  await userRedis.del(getKey(userId, Key.USER_SEATS));
  await userRedis.del(getKey(userId, Key.USER_SCHEDULE));
  const seatData = await itemController.deleteSeatData(scheduleId, userSeatIdArray);

  return { scheduleId, seats: seatData };
};

export default {
  deleteUserData,
  deleteUserSeatData,
  setUserSeatData,
  setScheduleIdOfUser,
  setUserIdOfSocket,
  getUserIdOfSocket,
  completeUserData,
};

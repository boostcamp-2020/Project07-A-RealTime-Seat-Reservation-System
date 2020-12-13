<<<<<<< HEAD
import { userRedis } from "../db/redis";
=======
import { userRedis, itemRedis } from "../db/redis";
import itemController from "../controllers/item";
>>>>>>> 52815ae704275048f0dbee552d24559a8455b79a
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
<<<<<<< HEAD
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
=======
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
>>>>>>> 52815ae704275048f0dbee552d24559a8455b79a
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

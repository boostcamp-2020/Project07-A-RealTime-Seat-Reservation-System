import { itemRedis, userRedis } from "../db/redis";
import userController from "./user";
import { getExpireKey, getKey } from "../utils";
import { SeatDataInterface, ColorInterface } from "../types";
import { Status, Key, Color } from "../constants";

const setExpireSeat = async (userId: string, scheduleId: string, seatIdArray: [string]) => {
  await Promise.all(
    seatIdArray.map((id) => {
      const newExpireKey = getExpireKey(userId, scheduleId, id);
      return userRedis.setex(newExpireKey, 5, "expire");
    }),
  );
};

const unSetExpireSeat = async (userId: string, scheduleId: string, seatIdArray: [string]) => {
  await Promise.all(
    seatIdArray.map((id) => {
      const newExpireKey = getExpireKey(userId, scheduleId, id);
      return userRedis.del(newExpireKey);
    }),
  );
};

const setClassCount = async (scheduleId: string, className: string, count: number) => {
  const countDataJSON = await itemRedis.hget(getKey(scheduleId, Key.COUNTS), className);
  if (!countDataJSON) throw Error;

  const countData = JSON.parse(countDataJSON);
  const newCount = parseInt(countData, 10) + count;

  await itemRedis.hset(getKey(scheduleId, Key.COUNTS), className, newCount.toString());
};

const getAllClassCount = async (scheduleId: string) => {
  const countData = await itemRedis.hgetall(getKey(scheduleId, Key.COUNTS));
  const countArray = [countData];

  return { counts: countArray };
};

const getSeatDataByScheduleId = async (scheduleId: string) => {
  if (typeof scheduleId !== "string") {
    throw Error;
  }

  const seatData = await itemRedis.hgetall(getKey(scheduleId, Key.SEATS));
  const seats = Object.values(seatData);

  return { seats: seats.map((seat) => JSON.parse(seat)) };
};

const clickSeat = async (userId: string, scheduleId: string, seat: SeatDataInterface) => {
  const seatDataJSON = await itemRedis.hget(getKey(scheduleId, Key.SEATS), seat._id);
  if (!seatDataJSON) {
    const newSeatData: SeatDataInterface = {
      ...seat,
      color: Color.CLICKED_SEAT,
      status: Status.CLICKED,
    };
    await itemRedis.hset(getKey(scheduleId, Key.SEATS), seat._id, JSON.stringify(newSeatData));
    // await userController.setUserSeatData(userId, newSeatData);
    // await setClassCount(scheduleId, newSeatData.class, -1);
    await setExpireSeat(userId, scheduleId, [newSeatData._id]);

    return { seats: [newSeatData] };
  }

  await itemRedis.hdel(getKey(scheduleId, Key.SEATS), seat._id);
  // await setClassCount(scheduleId, seat.class, 1);
  // await userController.setUserSeatData(userId, seat);
  const colorObj: ColorInterface = Color;
  const newColor = colorObj[seat.class];
  const newSeatData = [{ ...seat, color: newColor, status: Status.UNSOLD }];

  return { seats: newSeatData };
};

const setCancelingSeats = async (
  userId: string,
  scheduleId: string,
  seats: [SeatDataInterface],
) => {
  const newSeatArray = seats.map((seat) => {
    const newSeatData = {
      ...seat,
      color: Color.CANCELING_SEAT,
      status: Status.CANCELING,
    };

    return newSeatData;
  });

  await Promise.all(
    newSeatArray.map((seat) => {
      return itemRedis.hset(getKey(scheduleId, Key.SEATS), seat._id, JSON.stringify(seat));
    }),
  );

  await Promise.all(
    newSeatArray.map((seat) => {
      return userController.setUserSeatData(userId, seat);
    }),
  );

  return { seats: newSeatArray };
};

const setUnSoldSeats = async (userId: string, scheduleId: string, seats: [SeatDataInterface]) => {
  await Promise.all(
    seats.map((seat: SeatDataInterface) => {
      return itemRedis.hdel(getKey(scheduleId, Key.SEATS), seat._id);
    }),
  );

  let newCountObj: { [key: string]: number } = {};

  seats.forEach((seat) => {
    newCountObj = {
      ...newCountObj,
      [seat.class]: newCountObj[seat.class] === undefined ? 1 : newCountObj[seat.class] + 1,
    };
  });

  await Promise.all(
    Object.entries(newCountObj).map((data) => {
      return setClassCount(scheduleId, data[0], data[1]);
    }),
  );

  await Promise.all(
    seats.map((seat) => {
      return userController.deleteUserSeatData(userId, seat);
    }),
  );

  const colorObj: ColorInterface = Color;
  const newSeats = seats.map((seat) => {
    const newColor = colorObj[seat.class];

    return { ...seat, color: newColor, status: Status.SOLD };
  });

  return { seats: newSeats };
};

const setSoldSeats = async (userId: string, scheduleId: string, seats: [SeatDataInterface]) => {
  await Promise.all(
    seats.map((seat: SeatDataInterface) => {
      return itemRedis.hdel(getKey(scheduleId, Key.SEATS), seat._id);
    }),
  );

  await Promise.all(
    seats.map((seat) => {
      return userController.setUserSeatData(userId, seat);
    }),
  );

  return { seats: seats.map((seat) => ({ ...seat, color: Color.SOLD_SEAT, status: Status.SOLD })) };
};

const expireSeat = async (scheduleId: string, seatId: string) => {
  const seatDataJSON = await itemRedis.hget(getKey(scheduleId, Key.SEATS), seatId);
  if (!seatDataJSON) {
    throw Error;
  }

  const seatData = JSON.parse(seatDataJSON);

  const colorObj: ColorInterface = Color;
  const newColor = colorObj[seatData.class];
  const expiredSeat = { ...seatData, status: Status.UNSOLD, color: newColor };

  await itemRedis.hdel(getKey(scheduleId, Key.SEATS), seatData.id);
  // await setClassCount(scheduleId, expiredSeat.class, 1);

  return { seats: [expiredSeat] };
};

export default {
  setExpireSeat,
  unSetExpireSeat,
  getSeatDataByScheduleId,
  clickSeat,
  getAllClassCount,
  expireSeat,
  setCancelingSeats,
  setUnSoldSeats,
  setSoldSeats,
};

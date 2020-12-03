import { itemRedis, userRedis } from "../db/redis";
import { Status, Color, Class, Key } from "../constants";

interface ISeatData {
  id: any;
  class: string;
  name: string;
  point: object;
  status: string;
  color: string;
}

const getKey = (id: string, key: string) => {
  return `${id}-${key}`;
};

const setUserSeatData = async (socketId: string, seatData: ISeatData) => {
  if (seatData.status === Status.UNSOLD || seatData.status === Status.SOLD) {
    await userRedis.hdel(getKey(socketId, Key.USER_SEATS), seatData.id);
  }
  if (seatData.status === Status.CLICKED || seatData.status === Status.CANCELING) {
    await userRedis.hset(getKey(socketId, Key.USER_SEATS), seatData.id, JSON.stringify(seatData));
  }
};

const setClassCount = async (scheduleId: string, seatData: ISeatData) => {
  const count = (await itemRedis.hget(getKey(scheduleId, Key.COUNTS), seatData.class)) as string;
  let newCount = parseInt(count, 10);

  if (seatData.status === Status.UNSOLD) {
    newCount += 1;
  }
  if (seatData.status === Status.CLICKED) {
    newCount -= 1;
  }

  await itemRedis.hset(getKey(scheduleId, Key.COUNTS), seatData.class, newCount.toString());
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

const clickSeat = async (socketId: string, scheduleId: string, seatData: ISeatData) => {
  if (
    typeof socketId !== "string" ||
    typeof scheduleId !== "string" ||
    typeof seatData !== "object"
  ) {
    throw Error;
  }

  let newSeatData: any;

  if (seatData.status === Status.UNSOLD) {
    newSeatData = { ...seatData, color: Color.CLICKED_SEAT, status: Status.CLICKED };
  }
  if (seatData.status === Status.CLICKED) {
    const newKey = Object.keys(Class).find(
      (key) => (Class as any)[key] === seatData.class,
    ) as string;
    const newColor = (Color as any)[newKey];
    newSeatData = { ...seatData, color: newColor, status: Status.UNSOLD };
  }

  await itemRedis.hset(getKey(scheduleId, Key.SEATS), newSeatData.id, JSON.stringify(newSeatData));
  await setClassCount(scheduleId, newSeatData);
  await setUserSeatData(socketId, newSeatData);

  // const newExpireKey = `${socketId}"Delimiter"${scheduleId}"Delimiter"${JSON.stringify(
  //   newSeatData,
  // )}`;
  // userRedis.setex(newExpireKey, 5, "expire");
};

const setCancelingSeats = async (socketId: string, scheduleId: string, seatArray: [ISeatData]) => {
  const newSeatArray = seatArray.map((seat) => {
    const newSeatData = {
      ...seat,
      color: Color.CANCELING_SEAT,
      status: Status.CANCELING,
    };

    return newSeatData;
  });

  await Promise.all(
    newSeatArray.map((seat) => {
      return itemRedis.hset(getKey(scheduleId, Key.SEATS), seat.id, JSON.stringify(seat));
    }),
  );

  await Promise.all(
    newSeatArray.map((seat: ISeatData) => {
      return setUserSeatData(socketId, seat);
    }),
  );
};

const setUnSoldSeats = async (socketId: string, scheduleId: string, seatArray: [ISeatData]) => {
  const newSeatArray = seatArray.map((seat) => {
    const newKey = Object.keys(Class).find((key) => (Class as any)[key] === seat.class) as string;
    const newColor = (Color as any)[newKey];
    const newSeatData = {
      ...seat,
      color: newColor,
      status: Status.UNSOLD,
    };

    return newSeatData;
  });

  await Promise.all(
    newSeatArray.map((seat: ISeatData) => {
      return itemRedis.hset(getKey(scheduleId, Key.SEATS), seat.id, JSON.stringify(seat));
    }),
  );

  await Promise.all(
    newSeatArray.map((seat: ISeatData) => {
      return setClassCount(scheduleId, seat);
    }),
  );

  await Promise.all(
    newSeatArray.map((seat: ISeatData) => {
      return setUserSeatData(socketId, seat);
    }),
  );
};

const setSoldSeats = async (socketId: string, scheduleId: string, seatArray: [ISeatData]) => {
  const newSeatArray = seatArray.map((seat) => {
    const newSeatData = {
      ...seat,
      color: Color.SOLD_SEAT,
      status: Status.SOLD,
    };

    return newSeatData;
  });

  await Promise.all(
    newSeatArray.map((seat) => {
      return itemRedis.hset(getKey(scheduleId, Key.SEATS), seat.id, JSON.stringify(seat));
    }),
  );

  await Promise.all(
    newSeatArray.map((seat: ISeatData) => {
      return setUserSeatData(socketId, seat);
    }),
  );
};

const expireSeat = async (scheduleId: string, seatData: ISeatData) => {
  const newKey = Object.keys(Class).find((key) => (Class as any)[key] === seatData.class) as string;
  const newColor = (Color as any)[newKey];
  const expiredSeat = { ...seatData, status: Status.UNSOLD, color: newColor };

  await itemRedis.hset(getKey(scheduleId, Key.SEATS), seatData.id, JSON.stringify(expiredSeat));
  await setClassCount(scheduleId, expiredSeat);

  return seatData.id;
};

const setScheduleIdOfSocketId = async (socketId: string, scheduleId: string) => {
  await userRedis.set(getKey(socketId, Key.USER_SCHEDULE), scheduleId);
};

const deleteUserData = async (socketId: string) => {
  const scheduleId = await userRedis.get(getKey(socketId, Key.USER_SCHEDULE));
  const userSeatData = await userRedis.hgetall(getKey(socketId, Key.USER_SEATS));
  const userSeats = Object.values(userSeatData).map((seat) => JSON.parse(seat));

  const newSeatArray = userSeats.map((seat: any) => {
    if (seat.status === Status.CLICKED) {
      const newKey = Object.keys(Class).find((key) => (Class as any)[key] === seat.class) as string;
      const newColor = (Color as any)[newKey];

      return { ...seat, status: Status.UNSOLD, color: newColor };
    }

    if (seat.status === Status.CANCELING) {
      return { ...seat, status: Status.SOLD, color: Color.SOLD_SEAT };
    }

    return seat;
  });

  await Promise.all(
    newSeatArray.map((seat) =>
      itemRedis.hset(getKey(scheduleId as string, Key.SEATS), seat.id, JSON.stringify(seat)),
    ),
  );

  await Promise.all(newSeatArray.map((seat) => setClassCount(scheduleId as string, seat)));

  await userRedis.del(getKey(socketId, Key.USER_SEATS));
  await userRedis.del(getKey(socketId, Key.USER_SCHEDULE));

  return scheduleId;
};

export default {
  getSeatDataByScheduleId,
  clickSeat,
  getAllClassCount,
  expireSeat,
  deleteUserData,
  setScheduleIdOfSocketId,
  setCancelingSeats,
  setUnSoldSeats,
  setSoldSeats,
};

import { itemRedis, userRedis } from "../db/redis";
import { Status, Color, Class, Key } from "../constants";
import { SeatDataInterface, ColorInterface, ClassInterface } from "../types";

const getKey = (id: string, key: string) => {
  return `${id}-${key}`;
};

const setUserSeatData = async (socketId: string, seatData: SeatDataInterface) => {
  if (seatData.status === Status.UNSOLD || seatData.status === Status.SOLD) {
    await userRedis.hdel(getKey(socketId, Key.USER_SEATS), seatData.id);
  }
  if (seatData.status === Status.CLICKED || seatData.status === Status.CANCELING) {
    await userRedis.hset(getKey(socketId, Key.USER_SEATS), seatData.id, JSON.stringify(seatData));
  }
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

const clickSeat = async (socketId: string, scheduleId: string, seatId: string) => {
  if (
    typeof socketId !== "string" ||
    typeof scheduleId !== "string" ||
    typeof seatId !== "string"
  ) {
    throw Error;
  }

  const seatDataJSON = await itemRedis.hget(getKey(scheduleId, Key.SEATS), seatId);
  if (!seatDataJSON) {
    throw Error;
  }
  const seatData = JSON.parse(seatDataJSON);

  let newSeatData: SeatDataInterface;

  if (seatData.status === Status.UNSOLD) {
    newSeatData = { ...seatData, color: Color.CLICKED_SEAT, status: Status.CLICKED };
    await itemRedis.hset(
      getKey(scheduleId, Key.SEATS),
      newSeatData.id,
      JSON.stringify(newSeatData),
    );
    await setClassCount(scheduleId, newSeatData.class, -1);
    await setUserSeatData(socketId, newSeatData);
  }

  if (seatData.status === Status.CLICKED) {
    const classObj: ClassInterface = Class;
    const colorObj: ColorInterface = Color;

    const newKey = Object.keys(classObj).find((key) => classObj[key] === seatData.class);
    if (newKey) {
      const newColor = colorObj[newKey];
      newSeatData = { ...seatData, color: newColor, status: Status.UNSOLD };
      await itemRedis.hset(
        getKey(scheduleId, Key.SEATS),
        newSeatData.id,
        JSON.stringify(newSeatData),
      );
      await setClassCount(scheduleId, newSeatData.class, 1);
      await setUserSeatData(socketId, newSeatData);
    }

    if (!newKey) throw Error;
  }

  // const newExpireKey = `${socketId}"Delimiter"${scheduleId}"Delimiter"${JSON.stringify(
  //   newSeatData,
  // )}`;
  // userRedis.setex(newExpireKey, 5, "expire");
};

const setCancelingSeats = async (socketId: string, scheduleId: string, seatIdArray: [string]) => {
  const seatDataJSONArray = await Promise.all(
    seatIdArray.map((id: string) => {
      return itemRedis.hget(getKey(scheduleId, Key.SEATS), id);
    }),
  );
  const seatArray = seatDataJSONArray.map((seat) => JSON.parse(seat as string));

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
    newSeatArray.map((seat) => {
      return setUserSeatData(socketId, seat);
    }),
  );
};

const setUnSoldSeats = async (socketId: string, scheduleId: string, seatIdArray: [string]) => {
  const seatDataJSONArray = await Promise.all(
    seatIdArray.map((id: string) => {
      return itemRedis.hget(getKey(scheduleId, Key.SEATS), id);
    }),
  );
  const seatArray = seatDataJSONArray.map((seat) => JSON.parse(seat as string));

  const newSeatArray = seatArray.map((seat) => {
    const classObj: ClassInterface = Class;
    const colorObj: ColorInterface = Color;

    const newKey = Object.keys(classObj).find((key) => classObj[key] === seat.class);
    if (!newKey) throw Error;

    const newColor = colorObj[newKey];
    const newSeatData: SeatDataInterface = {
      ...seat,
      color: newColor,
      status: Status.UNSOLD,
    };

    return newSeatData;
  });

  await Promise.all(
    newSeatArray.map((seat) => {
      return itemRedis.hset(getKey(scheduleId, Key.SEATS), seat.id, JSON.stringify(seat));
    }),
  );

  let newCountObj: { [key: string]: number } = {};

  newSeatArray.forEach((seat: SeatDataInterface) => {
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
    newSeatArray.map((seat) => {
      return setUserSeatData(socketId, seat);
    }),
  );
};

const setSoldSeats = async (socketId: string, scheduleId: string, seatIdArray: [string]) => {
  const seatDataJSONArray = await Promise.all(
    seatIdArray.map((id: string) => {
      return itemRedis.hget(getKey(scheduleId, Key.SEATS), id);
    }),
  );

  const seatArray = seatDataJSONArray.map((seat) => JSON.parse(seat as string));
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
    newSeatArray.map((seat) => {
      return setUserSeatData(socketId, seat);
    }),
  );
};

const expireSeat = async (scheduleId: string, seatId: string) => {
  const seatDataJSON = await itemRedis.hget(getKey(scheduleId, Key.SEATS), seatId);
  if (!seatDataJSON) {
    throw Error;
  }

  const seatData = JSON.parse(seatDataJSON);

  const classObj: ClassInterface = Class;
  const colorObj: ColorInterface = Color;

  const newKey = Object.keys(classObj).find((key) => classObj[key] === seatData.class);
  if (!newKey) throw Error;
  const newColor = colorObj[newKey];
  const expiredSeat = { ...seatData, status: Status.UNSOLD, color: newColor };

  await itemRedis.hset(getKey(scheduleId, Key.SEATS), seatData.id, JSON.stringify(expiredSeat));
  await setClassCount(scheduleId, expiredSeat.class, 1);

  return seatData.id;
};

const setScheduleIdOfSocketId = async (socketId: string, scheduleId: string) => {
  await userRedis.set(getKey(socketId, Key.USER_SCHEDULE), scheduleId);
};

const deleteUserData = async (socketId: string) => {
  const scheduleId = await userRedis.get(getKey(socketId, Key.USER_SCHEDULE));
  const userSeatData = await userRedis.hgetall(getKey(socketId, Key.USER_SEATS));
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
      itemRedis.hset(getKey(scheduleId as string, Key.SEATS), seat.id, JSON.stringify(seat)),
    ),
  );

  await Promise.all(
    Object.entries(newCountObj).map((data) => {
      return setClassCount(scheduleId as string, data[0], data[1]);
    }),
  );

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

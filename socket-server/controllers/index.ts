import { concertRedis, userRedis } from "../db/redis";
import { Status, Color, Class } from "../constants";

interface ISeatData {
  id: any;
  class: string;
  name: string;
  point: object;
  status: string;
  color: string;
}

const getAllDataByConcertId = async (concertId: string) => {
  if (typeof concertId !== "string") {
    throw Error;
  }

  const data = await concertRedis.hgetall(concertId);

  const countData = JSON.parse(data.counts);
  const countArray = Object.entries(countData).map((e) => ({ class: e[0], count: e[1] }));
  delete data.counts;

  const seats = Object.values(data);

  return { seats: seats.map((seat) => JSON.parse(seat)), counts: countArray };
};

const changeData = async (
  socketId: string,
  concertId: string,
  seatId: string,
  seatData: ISeatData,
) => {
  if (
    typeof socketId !== "string" ||
    typeof concertId !== "string" ||
    typeof seatId !== "string" ||
    typeof seatData !== "object"
  ) {
    throw Error;
  }

  await concertRedis.hset(concertId, seatId, JSON.stringify(seatData));

  let counts = JSON.parse((await concertRedis.hget(concertId, "counts")) as string);
  const count = counts[seatData.class];
  let newCount;

  if (seatData.status === Status.UNSOLD) {
    newCount = parseInt(count, 10) + 1;
    await userRedis.hdel(socketId, seatId);
  }
  if (seatData.status === Status.CLICKED) {
    newCount = parseInt(count, 10) - 1;
    await userRedis.hset(socketId, seatId, "true");
  }

  counts = { ...counts, [seatData.class]: newCount };
  await concertRedis.hset(concertId, "counts", JSON.stringify(counts));

  const allData = await getAllDataByConcertId(concertId);

  return allData;
};

const getAllClassCount = async (concertId: string) => {
  const countData = JSON.parse((await concertRedis.hget(concertId, "counts")) as string);
  const countArray = Object.entries(countData).map((e) => ({ class: e[0], count: e[1] }));

  return { counts: countArray };
};

const expireSeat = async (concertId: string, seatData: ISeatData) => {
  // let newColor;
  // Object.keys(Class).forEach((key) => {
  //   if ((Class as any)[key] === seatData.class) newColor = (Color as any)[key];
  // });
  const expiredSeat = { ...seatData, status: Status.UNSOLD, color: Color.UNSOLD_SEAT };

  await concertRedis.hset(concertId, seatData.id, JSON.stringify(expiredSeat));

  const counts = JSON.parse((await concertRedis.hget(concertId, "counts")) as string);
  const count = counts[seatData.class];
  const newCount = parseInt(count, 10) + 1;
  const newCounts = { ...counts, [seatData.class]: newCount };
  await concertRedis.hset(concertId, "counts", JSON.stringify(newCounts));

  return seatData.id;
};

const deleteUser = async (socketId: string) => {
  await userRedis.del(socketId);
};

export default {
  getAllDataByConcertId,
  changeData,
  getAllClassCount,
  expireSeat,
  deleteUser,
};

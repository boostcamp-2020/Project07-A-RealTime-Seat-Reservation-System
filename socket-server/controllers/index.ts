import redisClient from "../db/redis";

const getSeatListData = async (key: string) => {
  if (typeof key !== "string") {
    throw Error;
  }
  const data = await redisClient.hgetall(key);
  const seats = Object.values(data);

  return seats.map((seat) => JSON.parse(seat));
};

const setSeatData = async (key: string, seatId: string, seatData: object) => {
  if (typeof key !== "string" || typeof seatId !== "string" || typeof seatData !== "object") {
    throw Error;
  }
  const result = await redisClient.hset(key, seatId, JSON.stringify(seatData));

  return result;
};

export { getSeatListData, setSeatData };

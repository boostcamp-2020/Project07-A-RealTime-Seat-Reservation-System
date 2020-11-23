import { redisClient } from "../db/redis";

const getSeatListData = async (key: string) => {
  const data = await redisClient.hgetall(key);

  return Object.values(data);
};

const setSeatData = async (namespace: string, room: string, seat: string) => {
  await redisClient.hset(namespace, room, seat);
};

export { getSeatListData, setSeatData };

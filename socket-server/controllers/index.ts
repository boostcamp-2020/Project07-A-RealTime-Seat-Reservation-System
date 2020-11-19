import redisClient from "../db/redis";

const getSeatListData = async (namespace: string, room: string) => {
  const [data] = await redisClient.hmget(namespace, room);
  if (typeof data === "string") return JSON.parse(data);

  return false;
};

const setSeatData = async (namespace: string, room: string, seat: string) => {
  await redisClient.hset(namespace, room, seat);
};

export { getSeatListData, setSeatData };

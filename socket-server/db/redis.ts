import Redis from "ioredis";

const redisHost =
  process.env.NODE_ENV === "production"
    ? process.env.REDIS_PRODUCTION_HOST
    : (process.env.REDIS_LOCAL_HOST as string);

export default new Redis(6379, redisHost);

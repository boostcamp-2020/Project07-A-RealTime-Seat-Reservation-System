import Redis from "ioredis";

const redisHost =
  process.env.NODE_ENV === "production"
    ? process.env.REDIS_PRODUCTION_HOST
    : (process.env.REDIS_LOCAL_HOST as string);

const redisClient = new Redis(6379, redisHost, { password: process.env.REIDS_PASSWORD });

const connectRedis = () => {
  redisClient.connect(() => {
    console.log("welcome redis");
  });
};

export { connectRedis, redisClient };

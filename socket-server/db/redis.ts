import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisHost =
  process.env.NODE_ENV === "production"
    ? process.env.REDIS_PRODUCTION_HOST
    : (process.env.REDIS_LOCAL_HOST as string);

const concertRedis = new Redis(6379, redisHost, { password: process.env.REDIS_PASSWORD });

const userRedis = new Redis(6379, redisHost, { password: process.env.REDIS_PASSWORD });
userRedis.select(1);
userRedis.config("SET", "notify-keyspace-events", "Ex");

const subRedis = new Redis(6379, redisHost, { password: process.env.REDIS_PASSWORD });

export { concertRedis, subRedis, userRedis };

import io from "socket.io-client";
import { PubSub } from "apollo-server-express";

const socketHost = (process.env.NODE_ENV === "production"
  ? process.env.SOCKET_PRODUCTION_HOST
  : process.env.SOCKET_LOCAL_HOST) as string;

const socket = io(socketHost, {
  transports: ["websocket"],
  upgrade: false,
});

const pubsub = new PubSub();

export { pubsub, socket };

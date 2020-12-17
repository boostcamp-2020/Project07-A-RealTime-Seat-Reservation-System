import io from "socket.io-client";
import dotenv from "dotenv";

dotenv.config();

const socketHost = (process.env.NODE_ENV === "production"
  ? process.env.SOCKET_PRODUCTION_HOST
  : process.env.SOCKET_LOCAL_HOST) as string;

const socket = io(socketHost, {
  transports: ["websocket"],
  upgrade: false,
});

export default socket;

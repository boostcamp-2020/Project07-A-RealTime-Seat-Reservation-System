import socketIO from "socket.io";
import http from "http";
import { connectRedis } from "./db/redis";
import { getSeatListData, setSeatData } from "./controllers";

connectRedis();

const server = http.createServer();

const io = new socketIO.Server(server, {
  cors: {
    origin: "*.*",
    methods: ["GET", "POST"],
  },
});

const concertNamespace = io.of(/^\/\w+$/);

concertNamespace.on("connection", async (socket: any) => {
  socket.on("joinRoom", async (key: string) => {
    socket.join(key);

    const seatData = await getSeatListData(key);
    concertNamespace.to(key).emit("data", seatData);
  });

  socket.on("click", async (key: string, seatId: any, color: any) => {
    await setSeatData(key, seatId, color);

    const seatData = await getSeatListData(key);
    concertNamespace.to(key).emit("data", seatData);
  });
});

server.listen(8080);

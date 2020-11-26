import socketIO from "socket.io";
import http from "http";
import { subRedis, userRedis } from "./db/redis";

import controller from "./controllers";

const Server = () => {
  const server = http.createServer();

  const io = new socketIO.Server(server, {
    cors: {
      origin: "*.*",
      methods: ["GET", "POST"],
    },
  });
  const concertNamespace = io.of(/^\/\w+$/);

  const subRedisClient = subRedis;
  const userRedisClient = userRedis;

  concertNamespace.on("connection", async (socket: any) => {
    concertNamespace.sockets.set(socket.id, socket);

    socket.on("disconnecting", async () => {
      if (concertNamespace.sockets.delete(socket.id)) {
        await controller.deleteUser(socket.id);
      }
    });

    socket.on("joinRoom", async (concertId: string) => {
      socket.join(concertId);

      const data = await controller.getAllDataByConcertId(concertId);
      socket.emit("receiveData", data);
    });

    // socket.on("clickCount", async (concertId: string) => {
    //   const countData = await controller.getAllClassCount(concertId);
    //   socket.emit("receiveCount", countData);
    // });

    socket.on("clickSeat", async (concertId: string, seatId: any, seatData: any) => {
      const data = await controller.changeData(socket.id, concertId, seatId, seatData);
      concertNamespace.to(concertId).emit("receiveData", data);

      const newKey = `${socket.id}"Delimiter"${concertId}"Delimiter"${JSON.stringify(seatData)}`;
      userRedisClient.setex(newKey, 5, "true");
    });
  });

  subRedisClient.psubscribe("__key*__:*");
  subRedisClient.on("pmessage", async (pattern: any, channel: any, message: string) => {
    const [socketId, concertId, seatData] = message.split(`"Delimiter"`);

    if (concertNamespace.sockets.get(socketId) as socketIO.Socket) {
      const expiredSeat = await controller.expireSeat(concertId, JSON.parse(seatData));
      const allData = await controller.getAllDataByConcertId(concertId);

      (concertNamespace.sockets.get(socketId) as socketIO.Socket).emit("expireSeat", expiredSeat);
      concertNamespace.to(concertId).emit("receiveData", allData);
    }
  });

  server.listen(8080);
};

Server();

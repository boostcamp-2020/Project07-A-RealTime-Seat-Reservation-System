import socketIO from "socket.io";
import http from "http";
// import { subRedis } from "./db/redis";

import controller from "./controllers";

const Server = () => {
  const server = http.createServer();

  const io = new socketIO.Server(server, {
    cors: {
      origin: "*.*",
      methods: ["GET", "POST"],
    },
  });
  const itemNamespace = io.of(/^\/\w+$/);

  // const subRedisClient = subRedis;

  itemNamespace.on("connection", async (socket: any) => {
    socket.on("disconnecting", async () => {
      const scheduleId = await controller.deleteUserData(socket.id);
      if (scheduleId) {
        const seats = await controller.getSeatDataByScheduleId(scheduleId as string);
        const counts = await controller.getAllClassCount(scheduleId as string);

        itemNamespace.to(`${scheduleId}-booking`).emit("receiveSeat", seats);
        itemNamespace.to(`${scheduleId}-booking`).emit("receiveCount", counts);
        itemNamespace.to(`${scheduleId}-count`).emit("receiveCount", counts);
      }
    });

    socket.on("joinBookingRoom", async (scheduleId: string) => {
      socket.join(`${scheduleId}-booking`);
      itemNamespace.sockets.set(socket.id, socket);

      await controller.setScheduleIdOfSocketId(socket.id, scheduleId);
      const seats = await controller.getSeatDataByScheduleId(scheduleId);
      const counts = await controller.getAllClassCount(scheduleId);

      itemNamespace.to(`${scheduleId}-booking`).emit("receiveSeat", seats);
      itemNamespace.to(`${scheduleId}-booking`).emit("receiveCount", counts);
      itemNamespace.to(`${scheduleId}-count`).emit("receiveCount", counts);
    });

    socket.on("leaveBookingRoom", async (scheduleId: string) => {
      socket.leave(`${scheduleId}-booking`);

      const sId = await controller.deleteUserData(socket.id);
      if (sId) {
        const seats = await controller.getSeatDataByScheduleId(scheduleId);
        const counts = await controller.getAllClassCount(scheduleId);

        itemNamespace.to(`${scheduleId}-booking`).emit("receiveSeat", seats);
        itemNamespace.to(`${scheduleId}-booking`).emit("receiveCount", counts);
        itemNamespace.to(`${scheduleId}-count`).emit("receiveCount", counts);
      }
    });

    socket.on("joinCountRoom", async (scheduleId: string) => {
      socket.join(`${scheduleId}-count`);

      const counts = await controller.getAllClassCount(scheduleId);
      socket.emit("receiveCount", counts);
    });

    socket.on("leaveCountRoom", async (scheduleId: string) => {
      socket.leave(`${scheduleId}-count`);
    });

    socket.on("willCancelBooking", async (scheduleId: string, seatData: any) => {
      await controller.setCancelingSeats(socket.id, scheduleId, seatData);
      const seats = await controller.getSeatDataByScheduleId(scheduleId);

      itemNamespace.to(`${scheduleId}-booking`).emit("receiveSeat", seats);
    });

    socket.on("notCancelBooking", async (scheduleId: string, seatData: any) => {
      await controller.setSoldSeats(socket.id, scheduleId, seatData);
      const seats = await controller.getSeatDataByScheduleId(scheduleId);

      itemNamespace.to(`${scheduleId}-booking`).emit("receiveSeat", seats);
    });

    socket.on("cancelBooking", async (scheduleId: string, seatData: any) => {
      await controller.setUnSoldSeats(socket.id, scheduleId, seatData);
      const seats = await controller.getSeatDataByScheduleId(scheduleId);
      const counts = await controller.getAllClassCount(scheduleId);

      itemNamespace.to(`${scheduleId}-booking`).emit("receiveSeat", seats);
      itemNamespace.to(`${scheduleId}-booking`).emit("receiveCount", counts);
      itemNamespace.to(`${scheduleId}-count`).emit("receiveCount", counts);
    });

    socket.on("bookSeat", async (scheduleId: string, seatData: any) => {
      await controller.setSoldSeats(socket.id, scheduleId, seatData);
      const seats = await controller.getSeatDataByScheduleId(scheduleId);

      itemNamespace.to(`${scheduleId}-booking`).emit("receiveSeat", seats);
    });

    socket.on("clickSeat", async (scheduleId: string, seatData: any) => {
      await controller.clickSeat(socket.id, scheduleId, seatData);
      const seats = await controller.getSeatDataByScheduleId(scheduleId);
      const counts = await controller.getAllClassCount(scheduleId);

      itemNamespace.to(`${scheduleId}-booking`).emit("receiveSeat", seats);
      itemNamespace.to(`${scheduleId}-booking`).emit("receiveCount", counts);
      itemNamespace.to(`${scheduleId}-count`).emit("receiveCount", counts);
    });
  });

  // subRedisClient.psubscribe("__key*__:*");
  // subRedisClient.on("pmessage", async (pattern: any, channel: any, message: string) => {
  //   const [socketId, scheduleId, seatData] = message.split(`"Delimiter"`);
  //   const privateSocket = itemNamespace.sockets.get(socketId) as socketIO.Socket;

  //   if (privateSocket) {
  //     const expiredSeatId = await controller.expireSeat(scheduleId, JSON.parse(seatData));
  //     const seats = await controller.getSeatDataByScheduleId(scheduleId);
  //     const counts = await controller.getAllClassCount(scheduleId);

  //     privateSocket.emit("expireSeat", expiredSeatId);
  //     itemNamespace.to(`${scheduleId}-booking`).emit("receiveSeat", seats);
  //     itemNamespace.to(`${scheduleId}-count`).emit("receiveCount", counts);
  //   }
  // });

  server.listen(8080);
};

Server();

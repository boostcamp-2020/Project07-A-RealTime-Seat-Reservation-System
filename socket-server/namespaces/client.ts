import socketIO from "socket.io";
import { subRedis } from "../db/redis";
import { userController, itemController } from "../controllers";

const getClientNamespace = (io: socketIO.Server) => {
  const clientNamespace = io.of("/client");

  clientNamespace.on("connection", async (socket: socketIO.Socket) => {
    socket.on("disconnecting", async () => {
      const userId = (await userController.getUserIdOfSocket(socket.id)) as string;
      const scheduleId = await userController.deleteUserData(userId);

      if (scheduleId) {
        const seats = await itemController.getSeatDataByScheduleId(scheduleId);
        const counts = await itemController.getAllClassCount(scheduleId);

        clientNamespace.to(`${scheduleId}-booking`).emit("receiveSeat", seats);
        clientNamespace.to(`${scheduleId}-booking`).emit("receiveCount", counts);
        clientNamespace.to(`${scheduleId}-count`).emit("receiveCount", counts);
      }
    });

    socket.on("joinBookingRoom", async (userId: string, scheduleId: string) => {
      clientNamespace.sockets.set(userId, socket);
      await userController.setUserIdOfSocket(socket.id, userId);
      await userController.setScheduleIdOfUser(userId, scheduleId);

      socket.join(`${scheduleId}-booking`);

      const seats = await itemController.getSeatDataByScheduleId(scheduleId);
      const counts = await itemController.getAllClassCount(scheduleId);

      clientNamespace.to(`${scheduleId}-booking`).emit("receiveSeat", seats);
      clientNamespace.to(`${scheduleId}-booking`).emit("receiveCount", counts);
      clientNamespace.to(`${scheduleId}-count`).emit("receiveCount", counts);
    });

    socket.on("leaveBookingRoom", async (userId: string, scheduleId: string) => {
      socket.leave(`${scheduleId}-booking`);
      const sId = await userController.deleteUserData(userId);

      if (sId) {
        const seats = await itemController.getSeatDataByScheduleId(scheduleId);
        const counts = await itemController.getAllClassCount(scheduleId);

        clientNamespace.to(`${scheduleId}-booking`).emit("receiveSeat", seats);
        clientNamespace.to(`${scheduleId}-booking`).emit("receiveCount", counts);
        clientNamespace.to(`${scheduleId}-count`).emit("receiveCount", counts);
      }
    });

    socket.on("joinCountRoom", async (scheduleId: string) => {
      socket.join(`${scheduleId}-count`);

      const counts = await itemController.getAllClassCount(scheduleId);
      socket.emit("receiveCount", counts);
    });

    socket.on("leaveCountRoom", async (scheduleId: string) => {
      socket.leave(`${scheduleId}-count`);
    });

    socket.on(
      "willCancelBooking",
      async (userId: string, scheduleId: string, seatIdArray: [string]) => {
        await itemController.setCancelingSeats(userId, scheduleId, seatIdArray);
        const seats = await itemController.getSeatDataByScheduleId(scheduleId);

        clientNamespace.to(`${scheduleId}-booking`).emit("receiveSeat", seats);
      },
    );

    socket.on(
      "notCancelBooking",
      async (userId: string, scheduleId: string, seatIdArray: [string]) => {
        await itemController.setSoldSeats(userId, scheduleId, seatIdArray);
        const seats = await itemController.getSeatDataByScheduleId(scheduleId);

        clientNamespace.to(`${scheduleId}-booking`).emit("receiveSeat", seats);
      },
    );

    socket.on("clickSeat", async (userId: string, scheduleId: string, seatId: string) => {
      await itemController.clickSeat(userId, scheduleId, seatId);
      const seats = await itemController.getSeatDataByScheduleId(scheduleId);
      const counts = await itemController.getAllClassCount(scheduleId);

      clientNamespace.to(`${scheduleId}-booking`).emit("receiveSeat", seats);
      clientNamespace.to(`${scheduleId}-booking`).emit("receiveCount", counts);
      clientNamespace.to(`${scheduleId}-count`).emit("receiveCount", counts);
    });

    socket.on(
      "unSetExpireSeat",
      async (userId: string, scheduleId: string, seatIdArray: [string]) => {
        await itemController.unSetExpireSeat(userId, scheduleId, seatIdArray);
      },
    );

    socket.on(
      "setExpireSeat",
      async (userId: string, scheduleId: string, seatIdArray: [string]) => {
        await itemController.setExpireSeat(userId, scheduleId, seatIdArray);
      },
    );
  });

  subRedis.psubscribe("__key*__:*");
  subRedis.on("pmessage", async (pattern: any, channel: any, message: string) => {
    const [userId, scheduleId, seatId] = message.split(":");
    const privateSocket = clientNamespace.sockets.get(userId) as socketIO.Socket;

    if (privateSocket) {
      const expiredSeatId = await itemController.expireSeat(scheduleId, seatId);
      const seats = await itemController.getSeatDataByScheduleId(scheduleId);
      const counts = await itemController.getAllClassCount(scheduleId);

      privateSocket.emit("expireSeat", expiredSeatId);
      clientNamespace.to(`${scheduleId}-booking`).emit("receiveSeat", seats);
      clientNamespace.to(`${scheduleId}-count`).emit("receiveCount", counts);
    }
  });
};

export default getClientNamespace;

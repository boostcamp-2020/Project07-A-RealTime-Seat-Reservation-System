import socketIO from "socket.io";
import { subRedis } from "../db/redis";
import { userController, itemController } from "../controllers";
import { SeatDataInterface } from "../types/index";

const getClientNamespace = (io: socketIO.Server) => {
  const clientNamespace = io.of("/client");

  clientNamespace.on("connection", async (socket: socketIO.Socket) => {
    socket.on("disconnecting", async () => {
      const userId = (await userController.getUserIdOfSocket(socket.id)) as string;
      if (userId) {
        const result = await userController.deleteUserData(userId);
        if (!result) return;

        const { scheduleId, seats } = result;
        const counts = await itemController.getAllClassCount(scheduleId);

        clientNamespace.to(`${scheduleId}-selection`).emit("receiveSeat", { seats });
        clientNamespace.to(`${scheduleId}-selection`).emit("receiveCount", counts);
        clientNamespace.to(`${scheduleId}-count`).emit("receiveCount", counts);
      }
    });

    socket.on("joinSelectionRoom", async (userId: string, scheduleId: string) => {
      clientNamespace.sockets.set(userId, socket);
      socket.join(`${scheduleId}-selection`);

      const seats = await itemController.getSeatDataByScheduleId(scheduleId);
      const counts = await itemController.getAllClassCount(scheduleId);

      clientNamespace.to(`${scheduleId}-selection`).emit("receiveSeat", seats);
      clientNamespace.to(`${scheduleId}-selection`).emit("receiveCount", counts);
      clientNamespace.to(`${scheduleId}-count`).emit("receiveCount", counts);
    });

    socket.on("leaveSelectionRoom", async (userId: string, scheduleId: string) => {
      clientNamespace.sockets.delete(userId);
      socket.leave(`${scheduleId}-selection`);
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
      async (userId: string, scheduleId: string, seatArray: [SeatDataInterface]) => {
        await userController.setUserIdOfSocket(socket.id, userId);
        await userController.setScheduleIdOfUser(userId, scheduleId);
        const seats = await itemController.setCancelingSeats(userId, scheduleId, seatArray);

        clientNamespace.to(`${scheduleId}-selection`).emit("receiveSeat", seats);
      },
    );

    socket.on("notCancelBooking", async (userId: string) => {
      const result = await userController.deleteUserData(userId);
      if (!result) return;

      const { scheduleId, seats } = result;
      clientNamespace.to(`${scheduleId}-selection`).emit("receiveSeat", { seats });
    });

    socket.on(
      "clickSeat",
      async (userId: string, scheduleId: string, seat: SeatDataInterface, status: string) => {
        const seats = await itemController.clickSeat(userId, scheduleId, seat, status);
        if (seats === null) {
          socket.emit("clickSeat", null);
        }

        if (seats !== null) {
          socket.emit("clickSeat", seats.seats[0]);
          const counts = await itemController.getAllClassCount(scheduleId);
          clientNamespace.to(`${scheduleId}-selection`).emit("receiveSeat", seats);
          clientNamespace.to(`${scheduleId}-selection`).emit("receiveCount", counts);
          clientNamespace.to(`${scheduleId}-count`).emit("receiveCount", counts);
        }
      },
    );

    socket.on(
      "joinBookingRoom",
      async (userId: string, scheduleId: string, seatIdArray: [string]) => {
        await userController.setUserIdOfSocket(socket.id, userId);
        await userController.setScheduleIdOfUser(userId, scheduleId);
        await itemController.setBookingSeats(userId, scheduleId, seatIdArray);
      },
    );

    socket.on("leaveBookingRoom", async (userId: string) => {
      const result = await userController.deleteUserData(userId);
      if (!result) return;

      const { scheduleId, seats } = result;
      const counts = await itemController.getAllClassCount(scheduleId);

      clientNamespace.to(`${scheduleId}-selection`).emit("receiveSeat", { seats });
      clientNamespace.to(`${scheduleId}-selection`).emit("receiveCount", counts);
    });
  });

  subRedis.psubscribe("__key*__:*");
  subRedis.on("pmessage", async (pattern: any, channel: any, message: string) => {
    const [userId, scheduleId, seatId] = message.split(":");
    const privateSocket = clientNamespace.sockets.get(userId);
    const expiredSeats = await itemController.expireSeat(scheduleId, seatId);
    if (expiredSeats !== null) {
      const counts = await itemController.getAllClassCount(scheduleId);

      clientNamespace.to(`${scheduleId}-selection`).emit("receiveSeat", expiredSeats);
      clientNamespace.to(`${scheduleId}-count`).emit("receiveCount", counts);
    }

    if (privateSocket) {
      privateSocket.emit("expireSeat", seatId);
    }
  });
};

export default getClientNamespace;

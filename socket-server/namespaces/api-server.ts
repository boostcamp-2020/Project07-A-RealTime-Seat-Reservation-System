import socketIO from "socket.io";
import { itemController, userController } from "../controllers";

const getApiServerNamespace = (io: socketIO.Server) => {
  const apiServerNamespace = io.of("/api-server");

  apiServerNamespace.on("connection", async (socket: socketIO.Socket) => {
    socket.on("disconnecting", async () => {});

    socket.on(
      "cancelBooking",
      async (userId: string, scheduleId: string, seatIdArray: [string]) => {
        await userController.completeUserData(userId);
        const seats = await itemController.completeSeats(scheduleId, seatIdArray);
        const counts = await itemController.getAllClassCount(scheduleId);

        io.of("/client").to(`${scheduleId}-selection`).emit("receiveSeat", seats);
        io.of("/client").to(`${scheduleId}-selection`).emit("receiveCount", counts);
        io.of("/client").to(`${scheduleId}-count`).emit("receiveCount", counts);
      },
    );

    socket.on("bookSeat", async (userId: string, scheduleId: string, seatIdArray: [string]) => {
      await userController.completeUserData(userId);
      const seats = await itemController.completeSeats(scheduleId, seatIdArray);

      io.of("/client").to(`${scheduleId}-selection`).emit("receiveSeat", seats);
    });
  });
};

export default getApiServerNamespace;

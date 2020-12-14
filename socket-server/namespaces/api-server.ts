import socketIO from "socket.io";
import { itemController } from "../controllers";
import { SeatDataInterface } from "../types/index";

const getApiServerNamespace = (io: socketIO.Server) => {
  const apiServerNamespace = io.of("/api-server");

  apiServerNamespace.on("connection", async (socket: socketIO.Socket) => {
    socket.on("disconnecting", async () => {});

    socket.on(
      "cancelBooking",
      async (userId: string, scheduleId: string, seatArray: [SeatDataInterface]) => {
        await itemController.setUnSoldSeats(userId, scheduleId, seatArray);

        const seats = await itemController.getSeatDataByScheduleId(scheduleId);
        const counts = await itemController.getAllClassCount(scheduleId);

        io.of("/client").to(`${scheduleId}-booking`).emit("receiveSeat", seats);
        io.of("/client").to(`${scheduleId}-booking`).emit("receiveCount", counts);
        io.of("/client").to(`${scheduleId}-count`).emit("receiveCount", counts);
      },
    );

    socket.on(
      "bookSeat",
      async (userId: string, scheduleId: string, seatArray: [SeatDataInterface]) => {
        await itemController.setSoldSeats(userId, scheduleId, seatArray);

        const seats = await itemController.getSeatDataByScheduleId(scheduleId);

        io.of("/client").to(`${scheduleId}-booking`).emit("receiveSeat", seats);
      },
    );
  });
};

export default getApiServerNamespace;

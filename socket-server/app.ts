import socketIO from "socket.io";
import http from "http";
import { getSeatListData, setSeatData } from "./controllers";

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

    const seats = await getSeatListData(key);
    concertNamespace.to(key).emit("receiveData", seats);
  });

  socket.on("clickSeat", async (key: string, seatId: string, seatData: object) => {
    await setSeatData(key, seatId, seatData);

    const seats = await getSeatListData(key);
    concertNamespace.to(key).emit("receiveData", seats);
  });
});

server.listen(8080);

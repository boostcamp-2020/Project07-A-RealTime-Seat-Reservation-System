import socketIO from "socket.io";
import app from "./app";
import { getSeatListData } from "./controllers";

const server = app.listen(8080, () => {
  console.log("listening");
});

const io: any = new socketIO.Server(server, {});

const concertNamespace = io.of(/^\/\w+$/);

concertNamespace.on("connection", async (socket: any) => {
  socket.on("joinRoom", async (namespace: any, roomId: any) => {
    const room = roomId;
    socket.join(room);

    const seatData = await getSeatListData(namespace, roomId);
    concertNamespace.to(roomId).emit("data", seatData);
  });

  //   socket.on("click", async (roomId: any, seatId: any, status: any) => {
  //     // const d = await fetch(`http://localhost:7676/seat`, {
  //     //   method: "POST",
  //     //   headers: {
  //     //     "Content-Type": "application/json",
  //     //     "Access-Control-Allow-Origin": "*",
  //     //   },
  //     //   body: JSON.stringify({
  //     //     namespace: "A",
  //     //     room: roomId,
  //     //     seat: seatId,
  //     //     status: status,
  //     //   }),
  //     // });
  //     // const ds = await d.json();
  //     // concertNamespace.to(roomId).emit("data", ds);
  //   });
});

function SocketWorker() {
  importScripts("https://cdnjs.cloudflare.com/ajax/libs/socket.io/3.0.1/socket.io.min.js");

  const socket = io.connect("http://localhost:8080/client", {
    transports: ["websocket"],
    upgrade: true,
  });

  self.onmessage = function (e) {
    const data = e.data;
    if (data.type === "clickSeat") {
      socket.emit("clickSeat", data.userId, data.scheduleId, data.seat);
    }
    if (data.type === "joinSelectionRoom") {
      socket.emit("joinSelectionRoom", data.userId, data.scheduleId);
    }
    if (data.type === "leaveSelectionRoom") {
      socket.emit("leaveSelectionRoom", data.userId, data.scheduleId);
    }
    if (data.type === "joinCountRoom") {
      socket.emit("joinCountRoom", data.scheduleId);
    }
    if (data.type === "leaveCountRoom") {
      socket.emit("leaveCountRoom", data.scheduleId);
    }
    if (data.type === "joinBookingRoom") {
      socket.emit("joinBookingRoom", data.userId, data.scheduleId, data.seatIdArray);
    }
    if (data.type === "leaveBookinRoom") {
      socket.emit("leaveCountRoom", data.userId);
    }
    if (data.type === "willCancelBooking") {
      socket.emit("willCancelBooking", data.userId, data.scheduleId, data.seatArray);
    }
    if (data.type === "notCancelBooking") {
      socket.emit("notCancelBooking", data.userId);
    }
  };

  socket.on("receiveSeat", (data) => {
    self.postMessage({ type: "seats", data: data.seats });
  });

  socket.on("receiveCount", (data) => {
    self.postMessage({ type: "counts", data: data.counts });
  });

  socket.on("expireSeat", (seatId) => {
    self.postMessage({ type: "expire", data: seatId });
  });
}

export default SocketWorker;

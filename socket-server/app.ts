import socketIO from "socket.io";
import http from "http";
import dotenv from "dotenv";
import namespace from "./namespaces";

dotenv.config();

const server = http.createServer();

const io = new socketIO.Server(server, {
  cors: {
    origin: "*.*",
    methods: ["GET", "POST"],
  },
});
namespace.getClientNamespace(io);
namespace.getApiServerNamespace(io);

server.listen(process.env.SOCKET_PORT);

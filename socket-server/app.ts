import socketIO from "socket.io";
import http from "http";
import namespace from "./namespaces";

const server = http.createServer();

const io = new socketIO.Server(server, {
  cors: {
    origin: "*.*",
    methods: ["GET", "POST"],
  },
});
namespace.getClientNamespace(io);
namespace.getApiServerNamespace(io);

server.listen(8080);

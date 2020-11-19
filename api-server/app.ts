import express from "express";
import { ApolloServer } from "apollo-server-express";
import depthLimit from "graphql-depth-limit";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";

import connectMongoDB from "./db/mongo";
import schema from "./schemas";

dotenv.config();
connectMongoDB();

const app = express();
app.use(cors());

const server = new ApolloServer({
  schema,
  validationRules: [depthLimit(11)],
});

server.applyMiddleware({ app, path: "/graphql" });

const httpServer = createServer(app);
httpServer.listen({ port: 7676 }, (): void => {
  console.log("graphql start");
});

import "graphql-import-node";
import { GraphQLSchema } from "graphql";
import { makeExecutableSchema } from "graphql-tools";

import typeDefs from "./types";
import resolvers from "../resolvers";

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;

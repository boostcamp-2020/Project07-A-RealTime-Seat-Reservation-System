import { ApolloClient, InMemoryCache } from "@apollo/client";

const URI = "http://115.85.182.195:7676/";

const client = new ApolloClient({
  uri: URI,
  cache: new InMemoryCache(),
});

export default client;

import { ApolloClient, InMemoryCache } from "@apollo/client";

const URI = process.env.REACT_APP_LOCAL_API_SERVER_URI;

const client = new ApolloClient({
  uri: URI,
  cache: new InMemoryCache(),
});

export default client;

import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from "@apollo/client";
import { LOCALSTORAGE_TOKEN } from "./strings";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from "@apollo/client/utilities";

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);

export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

/* 
console.log("default value of isLoggedInVar: ", isLoggedInVar());
console.log("default value of authTokenVar: ", authTokenVar()); 
*/
// when you login first, logs 'default value of isLoggedInVar: false' and 'default value of authTokenVar: null'
// when you refresh to login again, logs 'default value of isLoggedInVar: true' and 'default value of authTokenVar: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjk1NTQ2MDcxfQ.-VsBLCZZGmB-hBicrAo0KFdIoora5eJCLWefAAhJWgk'

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
    connectionParams: { // used to authenticate
      'x-jwt': authTokenVar() || "", 
    }
  }
})


const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-jwt": authTokenVar() || "",
    },
  };
});


const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink, // if returns 'true', Use the 'wsLink'
  authLink.concat(httpLink) // if returns 'false', Use the 'httpLink'
);


export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
          token: {
            read() {
              return authTokenVar();
            },
          },
        },
      },
    },
  }),
});

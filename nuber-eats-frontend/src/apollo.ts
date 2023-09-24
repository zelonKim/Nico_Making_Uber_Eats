import { ApolloClient, createHttpLink, InMemoryCache, makeVar } from "@apollo/client";
import { LOCALSTORAGE_TOKEN } from "./strings";
import { setContext } from "@apollo/client/link/context";

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);

export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

/* 
console.log("default value of isLoggedInVar: ", isLoggedInVar());
console.log("default value of authTokenVar: ", authTokenVar()); 
*/
// when you login first, logs 'default value of isLoggedInVar: false' and 'default value of authTokenVar: null'
// when you refresh to login again, logs 'default value of isLoggedInVar: true' and 'default value of authTokenVar: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjk1NTQ2MDcxfQ.-VsBLCZZGmB-hBicrAo0KFdIoora5eJCLWefAAhJWgk'



const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
})

const authLink = setContext((_, {headers}) => {
  console.log(headers)
  return {
    headers: {
      ...headers,
      "x-jwt": authTokenVar() || "",
    },
  };
}) 


export const client = new ApolloClient({
  link: authLink.concat(httpLink), 

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

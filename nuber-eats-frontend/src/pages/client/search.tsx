import React, { useEffect } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { Helmet } from "react-helmet";
import { useHistory, useLocation } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../fragments";
import {
  searchRestaurant,
  searchRestaurantVariables,
} from "../../__generated__/searchRestaurant";

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantsParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const Search = () => {
  const history = useHistory();
  const location = useLocation();

  const [callQuery, { loading, data, called }] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT);

  useEffect(() => {
    const [_, searchTerm] = location.search.split("?term=");

    if (!searchTerm) {
      return history.replace("/");
    }

    callQuery({
        variables: {
            input: {
                page: 1,
                query: searchTerm,
            }
        }
    })
  }, [history, location]);

  console.log(called, data); 
  // if there is not searchTerm, logs 'false  undefined'
  // if there is searchTerm, logs 'true  {searchRestaurant: {…}}'

  return (
    <h1>
      <Helmet>
        <title> Search | Nuber Eats</title>
      </Helmet>
      Search page
    </h1>
  );
};

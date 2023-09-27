import React from "react";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../fragments";
import { cateogry, cateogryVariables } from "../../__generated__/cateogry";

const CATEGORY_QUERY = gql`
  query cateogry($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface ICategoryParams {
  slug: string;
}



export const Category = () => {
  const params = useParams<ICategoryParams>();
  const { data, loading } = useQuery<cateogry, cateogryVariables>(CATEGORY_QUERY, {
    variables: {
      input: {
        page: 1,
        slug: params.slug,
      },
    },
  });
  console.log(data);
  return <h1> Category </h1>;
};

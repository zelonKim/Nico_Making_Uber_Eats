/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CategoryInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: cateogry
// ====================================================

export interface cateogry_category_restaurants_category {
  __typename: "Category";
  name: string;
}

export interface cateogry_category_restaurants {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  category: cateogry_category_restaurants_category | null;
  address: string;
  isPromoted: boolean;
}

export interface cateogry_category_category {
  __typename: "Category";
  id: number;
  name: string;
  coverImg: string | null;
  slug: string;
  restaurantCount: number;
}

export interface cateogry_category {
  __typename: "CategoryOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  restaurants: cateogry_category_restaurants[] | null;
  category: cateogry_category_category | null;
}

export interface cateogry {
  category: cateogry_category;
}

export interface cateogryVariables {
  input: CategoryInput;
}

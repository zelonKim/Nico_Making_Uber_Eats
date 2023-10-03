/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: pedingOrders
// ====================================================

export interface pedingOrders_pendingOrders_driver {
  __typename: "User";
  email: string;
}

export interface pedingOrders_pendingOrders_customer {
  __typename: "User";
  email: string;
}

export interface pedingOrders_pendingOrders_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface pedingOrders_pendingOrders {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  driver: pedingOrders_pendingOrders_driver | null;
  customer: pedingOrders_pendingOrders_customer | null;
  restaurant: pedingOrders_pendingOrders_restaurant | null;
}

export interface pedingOrders {
  pendingOrders: pedingOrders_pendingOrders;
}

import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import { editOrder, editOrderVariables } from "../__generated__/editOrder";
import { getOrder, getOrderVariables } from "../__generated__/getOrder";
import { OrderStatus, UserRole } from "../__generated__/globalTypes";
import {
  orderUpdates,
  orderUpdatesVariables,
} from "../__generated__/orderUpdates";
import { FULL_ORDER_FRAGMENT } from "./fragments";

const GET_ORDER = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const EDIT_ORDER = gql`
 mutation editOrder($input: EditOrderInput!) {
    editOrder(input: $input) {
      ok
      error
    }
  }
`

interface IParams {
  id: string;
}

export const Order = () => {
  const params = useParams<IParams>();
  const { data: userData } = useMe();
  const [editOrderMutation] = useMutation<editOrder, editOrderVariables>(EDIT_ORDER)
  
  const { data, subscribeToMore } = useQuery<getOrder, getOrderVariables>(
    GET_ORDER,
    {
      // useQuery hook returns 'subscribeToMore' function
      variables: {
        input: {
          id: +params.id,
        },
      },
    }
  );

  /* 
  const {data: subscriptionData} = useSubscription<orderUpdates, orderUpdatesVariables>(ORDER_SUBSCRIPTION, ({
        variables: {
            input: {
                id: +params.id,
            }
        }
    })
  ) 
  
  console.log(subscriptionData); 
*/

  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        // executes a follow-up subscription that pushes updates to the query`s original result
        document: ORDER_SUBSCRIPTION, // subscription name
        variables: {
          input: {
            id: +params.id,
          },
        },
        updateQuery: (
          prev,
          {
            subscriptionData: { data }, // updateQuery() takes 'a previous query result' and 'a new subscription data'
          }: { subscriptionData: { data: orderUpdates } }
        ) => {
          if (!data) return prev;
          return {
            getOrder: {
              ...prev.getOrder,
              order: {
                ...data.orderUpdates,
              },
            },
          };
        },
      });
    }
  }, [data]);

  
  const onButtonClick = (newStatus: OrderStatus) => {
    editOrderMutation({
      variables: {
        input: {
          id: + params.id,
          status: newStatus,
        }
      }
    })
  }

  return (
    <div className="container flex justify-center mt-32">
      <Helmet>
        <title>Order #{params.id} | Nuber Eats</title>
      </Helmet>
      <div className="flex flex-col justify-center w-full max-w-screen-sm border border-gray-800">
        <h4 className="w-full py-5 text-xl text-center text-white bg-gray-800">
          Order #{params.id}
        </h4>
        <h5 className="p-5 pt-10 text-3xl text-center ">
          ${data?.getOrder.order?.total}
        </h5>
        <div className="grid gap-6 p-5 text-xl">
          <div className="pt-5 border-t border-gray-700">
            Prepared By:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.restaurant?.name}
            </span>
          </div>
          <div className="pt-5 border-t border-gray-700 ">
            Deliver To:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.customer?.email}
            </span>
          </div>
          <div className="py-5 border-t border-b border-gray-700">
            Driver:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.driver?.email || "Not yet."}
            </span>
          </div>
          
          {userData?.me.role ===  UserRole.Client && (
            <span className="mt-5 mb-3 text-2xl text-center text-lime-600">
              Status: {data?.getOrder.order?.status}
            </span>
          )}
          
          {userData?.me.role === UserRole.Owner && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Pending && (
                <button onClick={() => onButtonClick(OrderStatus.Cooking)} className="btn"> Accept Order </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.Cooking && (
                <button onClick={() => onButtonClick(OrderStatus.Cooked)} className="btn"> Order Cooked </button>
              )}
            </>
          )}

          {
            data?.getOrder.order?.status !== OrderStatus.Pending  &&  data?.getOrder.order?.status !== OrderStatus.Cooking  
            && (
            <span className="mt-5 mb-3 text-2xl text-center text-lime-600">
              Status: {data?.getOrder.order?.status}
            </span>
            )
          }
        </div>
      </div>
    </div>
  );
};

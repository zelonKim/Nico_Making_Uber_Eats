import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useHistory, useParams } from "react-router-dom";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryPie,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";
import { Dish } from "../../components/dish";
import { useMe } from "../../hooks/useMe";
import {
  createPayment,
  createPaymentVariables,
} from "../../__generated__/createPayment";
import {
  myRestaurant,
  myRestaurantVariables,
} from "../../__generated__/myRestaurant";
import { pedingOrders } from "../../__generated__/pedingOrders";

import {
  DISH_FRAGMENT,
  FULL_ORDER_FRAGMENT,
  ORDERS_FRAGMENT,
  RESTAURANT_FRAGMENT,
} from "../fragments";



export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDERS_FRAGMENT}
`;

const CREATE_PAYMENT_MUTATION = gql`
  mutation createPayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      ok
      error
    }
  }
`;


const PENDING_ORDERS_SUBSCRIPTION = gql`
  subscription pedingOrders {
    pendingOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`


interface IParams {
  id: string;
}


export const MyRestaurant = () => {
  const { id } = useParams<IParams>();
  const { data } = useQuery<myRestaurant, myRestaurantVariables>(
    MY_RESTAURANT_QUERY,
    {
      variables: {
        input: {
          id: +id,
        },
      },
    }
  );
  console.log(data);


  const onCompleted = (data: createPayment) => {
    if (data.createPayment.ok) {
      alert("Your restaurant is being promoted!");
    }
  };
  const [createPaymentMutation, { loading }] = useMutation<
    createPayment,
    createPaymentVariables
  >(CREATE_PAYMENT_MUTATION, {
    onCompleted,
  });


  const { data: userData } = useMe()
  const triggerPaddle = () => {
    if (userData?.me.email) {
    //@ts-ignore
    window.Paddle.setup({ vendor: 1234}) // vendorId
    //@ts-ignore
    window.Paddle.Checkout.open({ 
      porduct: 5678, // porductId
      email: userData.me.email,
      successCallback: (data: any) => {
        createPaymentMutation({
          variables: {
            input: {
              transactionId: data.checkout.id,
              restaurantId: +id,
            }
          }
        })
      }
    }) 
  }
}
  

  const {data: subscriptionData} = useSubscription<pedingOrders>(PENDING_ORDERS_SUBSCRIPTION)
  
  const history = useHistory()
  
  useEffect(() => {
    if(subscriptionData?.pendingOrders.id) {
    history.push(`/orders/${subscriptionData.pendingOrders.id}`)    
    }
  }, [subscriptionData])
  
  
  return (
    <div>
      <Helmet>
        <title>
          {data?.myRestaurant.restaurant?.name || "Loading..."} | Nuber Eats
        </title>
        <script src="https://cdn.paddle.com/paddle/paddle.js"></script>
      </Helmet>
      <div
        className="bg-gray-700 bg-center bg-cover py-28"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
        }}
      ></div>
      <div className="container mt-10">
        <h2 className="mb-10 text-4xl font-medium">
          {data?.myRestaurant.restaurant?.name || "Loading..."}
        </h2>
        <Link
          to={`/restaurants/${id}/add-dish`}
          className="px-10 py-3 mr-8 text-white bg-gray-800 "
        >
          Add Dish &rarr;
        </Link>
        <span onClick={triggerPaddle} className="px-10 py-3 text-white bg-lime-700">
          Buy Promotion &rarr;
        </span>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <h4 className="mb-5 text-xl">You have no dish</h4>
          ) : (
            <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
              {data?.myRestaurant.restaurant?.menu.map((dish, index) => (
                <Dish
                  key={index}
                  name={dish.name}
                  description={dish.description}
                  price={dish.price}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-20 mb-10">
          <h4 className="text-2xl font-medium text-center">Sales</h4>
          <div className="mt-10 ">
            <VictoryChart
              height={500}
              theme={VictoryTheme.material}
              width={window.innerWidth}
              domainPadding={50}
              containerComponent={<VictoryVoronoiContainer />}
            >
              <VictoryLine
                labels={({ datum }) => `$${datum.y}`}
                labelComponent={
                  <VictoryTooltip
                    style={{ fontSize: 18 } as any}
                    renderInPortal
                    dy={-20}
                  />
                }
                data={data?.myRestaurant.restaurant?.orders.map((order) => ({
                  x: order.createdAt,
                  y: order.total,
                }))}
                interpolation="natural"
                style={{
                  data: {
                    strokeWidth: 5,
                  },
                }}
              />
              <VictoryAxis
                tickLabelComponent={<VictoryLabel renderInPortal />}
                style={{
                  tickLabels: {
                    fontSize: 20,
                  } as any,
                }}
                tickFormat={(tick) => new Date(tick).toLocaleDateString("ko")}
              />
            </VictoryChart>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { gql, useMutation } from "@apollo/client";
import {
  createRestaurant,
  createRestaurantVariables,
} from "../../__generated__/createRestaurant";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { Helmet } from "react-helmet-async";

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      error
      ok
    }
  }
`;

interface IFromProps {
  name: string;
  address: string;
  categoryName: string;
}

export const AddRestaurant = () => {
  const [createRestaurantMutation, { loading, data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION);

  const { register, getValues, formState, errors, handleSubmit } =
    useForm<IFromProps>({
        mode: "onChange"
    });


    
  const onSubmit = () => {
    const { name, address } = getValues()

    createRestaurantMutation(
        variables: {
            input: { 
                name, 
                address 
            }
        }
    )
  };



  return (
    <div className="container">
    <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
    </Helmet>
      <h1>Add Restaurant</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          name="name"
          placeholder="Name"
          type="text"
          className="input"
          ref={register({ required: "Name is required." })}
        />
        <input
          name="address"
          placeholder="Address"
          type="text"
          className="input"
          ref={register({ required: "Address is required." })}
        />
        <input
          name="categoryName"
          placeholder="Category Name"
          type="text"
          className="input"
          ref={register({ required: "Category Name is required." })}
        />
        <Button
          loading={loading}
          canClick={true}
          actionText="Create Restaurant"
        />
      </form>
    </div>
  );
};

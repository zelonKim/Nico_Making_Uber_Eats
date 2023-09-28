import React, { useState } from "react";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import {
  createRestaurant,
  createRestaurantVariables,
} from "../../__generated__/createRestaurant";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { Helmet } from "react-helmet-async";
import { FormError } from "../../components/form-error";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";
import { useHistory } from "react-router-dom";

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      error
      ok
      restaurantId
    }
  }
`;

interface IFromProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

export const AddRestaurant = () => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const client = useApolloClient();
  const history = useHistory();

  const { register, getValues, formState, errors, handleSubmit } =
    useForm<IFromProps>({
      mode: "onChange",
    });

  const onCompleted = (data: createRestaurant) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data;
    if (ok) {
      const { file, name, categoryName, address } = getValues();

      setUploading(false);

      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY }); // reads a data from a Cache, not a Server
      console.log(queryResult); // {myRestaurants: {…}}

      client.writeQuery({
        // updates the data in Cache
        query: MY_RESTAURANTS_QUERY,
        data: {
          // has to update with keeping the shape of data in Cache
          myRestaurants: {
            ...queryResult.myRestaurants, // should contain a previous data
            restaurants: [
              {
                __typename: "Restaurant",
                id: restaurantId,
                name,
                coverImg: imageUrl,
                address,
                category: {
                  __typename: "Category",
                  name: categoryName,
                },
                isPromoted: false,
              },
            ],
          },
        },
      });
      history.push("/");
    }
  };

  const [createRestaurantMutation, { loading, data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
    // refetchQueries: [{query: MY_RESTAURANTS_QUERY }]
  });

  const onSubmit = async () => {
    try {
      setUploading(true);
      const { file, name, categoryName, address } = getValues();
      const actualFile = file[0];

      const formBody = new FormData();
      formBody.append("file", actualFile);

      const { url: coverImg } = await (
        await fetch("http://localhost:4000/uploads/", {
          method: "POST",
          body: formBody,
        })
      ).json();

      setImageUrl(coverImg);

      createRestaurantMutation({
        variables: {
          input: {
            name,
            coverImg,
            address,
            categoryName,
          },
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="container flex flex-col items-center mt-40">
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Add Restaurant</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
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
        <div>
          <input
            type="file"
            name="file"
            accept="image/*"
            ref={register({ required: true })}
          />
        </div>

        <Button
          loading={uploading}
          canClick={true}
          actionText="Create Restaurant"
        />
        {data?.createRestaurant?.error && (
          <FormError errorMessage={data.createRestaurant.error} />
        )}
      </form>
    </div>
  );
};

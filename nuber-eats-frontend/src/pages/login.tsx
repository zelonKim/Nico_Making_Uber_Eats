import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { FormError } from '../components/form-error';


interface ILoginForm {
  email: string;
  password: string;
}


const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    Login(input: { email: $email, password: $password }) {
      ok
      token
      error
    }
  }
`;

export const Login = () => {
  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm<ILoginForm>();

  const [loginMutation, { loading, error, data }] = useMutation(LOGIN_MUTATION);

  
  const onSubmit = () => {
    const { email, password } = getValues();

    loginMutation({
      variables: {
        email,
        password,
      },
    });
  };

  
  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      <div className="w-full max-w-lg pt-5 text-center bg-white rounded-lg pb-7">
        <h3 className="text-3xl text-gray-800"> Log In </h3>
        
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 px-5 mt-5"
        >
          <input
            {...register('email', {
              required: 'Email is required',
            })}
            type="email"
            placeholder="Email"
            className="mb-3 input"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}


          <input
            {...register('password', {
              required: 'Password is required',
              minLength: 10,
            })}
            type="password"
            placeholder="Password"
            className="input"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}

          {errors.password?.type === 'minLength' && (
            <FormError errorMessage="Password must be more than 10 character." />
          )}
          
          <button className="mt-3 btn">Log in</button>
        </form>
      </div>
    </div>
  );
};

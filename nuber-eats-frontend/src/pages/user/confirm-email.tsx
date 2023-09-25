import React, { useEffect } from "react";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import {
  verifyEmail,
  verifyEmailVariables,
} from "../../__generated__/verifyEmail";
import { useHistory, useLocation } from "react-router-dom";
import { useMe } from "../../hooks/useMe";

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;



export const ConfirmEmail = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const history = useHistory();

  const onCompleted = (data: verifyEmail) => {
    const {
      verifyEmail: { ok },
    } = data;

    if(ok && userData?.me.id) {
        client.writeFragment({
            id: `User:${userData.me.id}`,
            fragment: gql`
                fragment VerifiedUser on User {
                    verified
                }
            `,
            data: {
                verified: true,
            },
        }); 
        history.push('/');
    }
  };

  const [verifyEmail] = useMutation<
    verifyEmail,
    verifyEmailVariables
  >(VERIFY_EMAIL_MUTATION, { onCompleted });

  const location = useLocation();

  useEffect(() => {
    const [_, code] = location.search.split("code=");
    verifyEmail({
        variables: {
            input: {
                code,
            },
        },
    });
  }, []);

  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <h1 className="text-lg mb-2 font-medium"> Confirming email... </h1>
    </div>
  );
};

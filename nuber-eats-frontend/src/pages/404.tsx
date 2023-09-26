import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export const NotFound = () => (
  <div className="h-screen flex flex-col items-center justify-center">
    <Helmet>
      <title> Not Found | Nuber Eats </title>
    </Helmet>
    <h2 className="font-semibold text-2xl mb-3">Page Not Found</h2>
    <Link className="hover:underline text-lime-500" to="/">
      {" "}
      Go back home &rarr;{" "}
    </Link>
  </div>
);

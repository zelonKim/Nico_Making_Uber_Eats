import React from "react";
import { Link } from "react-router-dom";

export const NotFound = () => (
  <div className="h-screen flex flex-col items-center justify-center">
    <h2 className="font-semibold text-2xl mb-3">Page Not Found</h2>
    <Link className="hover:underline text-lime-500" to="/">
      {" "}
      Go back home &rarr;{" "}
    </Link>
  </div>
);

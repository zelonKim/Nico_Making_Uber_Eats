import React from "react";
import { Link } from "react-router-dom";

interface IRestaurantProps {
  id: string;
  coverImg: string;
  name: string;
  categoryName?: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({
  id,
  coverImg,
  name,
  categoryName,
}) => (
  <Link to={`/restaurants/${id}`}>
    <div>
      <div className="flex flex-col">
        <div
          style={{ backgroundImage: `url(${coverImg})` }}
          className="bg-cover bg-center mb-3 py-28"
        ></div>
        <h3 className="text-xl font-medium">{name}</h3>
        <span className="text-sm border-t-2">{categoryName}</span>
      </div>
    </div>
  </Link>
);

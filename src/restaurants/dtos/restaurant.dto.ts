import { Restaurant } from "../entities/restaurant.entity";

export class RestaurantInput {
    @Field(type => Int)
    restaurantId: number;
}

@ObjectType()
export class RestaurantOutput extends CoreOutput {
    @Field(type => Restaurant, {nullable: true})
    restaurant?: Restaurant
}
import { Restaurant } from "../entities/restaurant.entity";
import { PaginationInput } from "./pagination.dto";

@InputType()
export class RestaurantsInput extends PaginationInput {}

@ObjectType()
export class RestaurantsOutput extends PaginationOutput {
    @Field(type => [Restaruant], {nullable: true})
    restaurants?: Restaurant[]
}
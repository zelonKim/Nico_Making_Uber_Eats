import { CoreOutput } from "src/common/dtos/ouput.dto";

@InputType()
export class DeleteRestaurantInput {
    @Field(type => Number)
    restaurantId: number;
}


@ObjectType()
export class DeleteRestaurantOutput extends CoreOutput {}
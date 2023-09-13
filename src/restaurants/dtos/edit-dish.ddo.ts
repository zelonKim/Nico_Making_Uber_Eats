import { PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/ouput.dto";

@InputType()
export class EditDishInput extends PickType(PartialType(Dish), ['name', 'options', 'price', 'description']) {
    @Field(type => Int)
    dishId: number;
}


@ObjectType()
export class EditDishOutput extends CoreOutput {}
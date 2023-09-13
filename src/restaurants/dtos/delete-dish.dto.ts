import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/ouput.dto";

@InputType()
export class DeleteDishInput {
    @Field(type => Int)
    dishId: number;
}

@ObjectType()
export class DeleteDishOutput extends CoreOutput {}
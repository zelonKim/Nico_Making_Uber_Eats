import { CoreOutput } from "src/common/dtos/ouput.dto";

@InputType()
export class CreateOrderInput extends PickType(Order, ['dishes']){
    @Field(type => Int)
    restaurantId: number;
}


@ObjectType()
export class CreateOrderOutput extends CoreOutput {
   
}
import { InputType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/ouput.dto";
import { Payment } from "../entities/payment.entity";

@InputType()
export class CreatePaymentInput extends PickType(Payment, ['transactionId', 'restaurantId']) {
    @Field(type => Int)
    restaurantId: number;
}


@ObjectType()
export class createPaymentOutput extends CoreOutput {}
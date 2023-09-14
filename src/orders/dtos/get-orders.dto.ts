import { InputType } from "@nestjs/graphql";
import { OrderStatus } from "src/orders/entities/order.entity";

@InputType()
export class GetOrdersInput {
    @Field(type => OrderStatus, {nullable: true})
    status?: OrderStatus;
}

////////////////

@ObjectType()
export class GetOrdersOutput extends CoreOutput {
    @Field(type => [Order], {nullable: true})
    orders?: Order[]
}

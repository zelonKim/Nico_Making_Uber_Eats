import { Resolver } from "@nestjs/graphql";
import { AuthUser } from "src/auth/authUser.decorator";
import { User } from "src/users/entities/user.entity";
import { createPaymentOutput } from "./dtos/create-payment.dto";
import { GetPaymentsOutput } from "./dtos/get-payments.dto";
import { PaymentService } from "./payments.service";

@Resolver((of) => Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation((returns) => createPaymentOutput)
  @Role(['Owner'])
  createPayment(
    @AuthUser() owner: User,
    @Args('input') createPaymentInput: CreatePaymentInput,
  ): Promise<createPaymentOutput> {
    return this.paymentService.createPayment(owner, createPaymentInput);
  }

  @Query(returns => GetPaymentsOutput)
  @Role(['Owner'])
  getPayments(@AuthUser() user: User):Promise<GetPaymentsOutput>{
    return this.paymentService.getPayments(user)
}
}
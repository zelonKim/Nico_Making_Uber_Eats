@ObjectType()
export class GetPaymentsOutput extends CoreOutput {
    @Field(type => [Payment], {nullable: true})
    payments?: Payment[]
}
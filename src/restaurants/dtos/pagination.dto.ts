import { CoreOutput } from "src/common/dtos/ouput.dto";



export class PaginationInput {
    @Field(type => Int, {defaultValue: 1})
    page: number;
}


@ObjectType()
export class PaginationOutput extends CoreOutput {
    @Field(type => Int, { nullable: true})
    totalPages?: number;
}
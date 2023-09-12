import { PaginationOutput } from "./pagination.dto";

@InputType()
export class SearchRestaurantInput extends PaginationOutput {
  @Field((type) => String)
  query: string;
}

@ObjectType()
export class SearchRestaurantOutput extends PaginationOutput {
    @Field(type => [Restaurant], {nullable: true})
    restaurants?: Restaurant[]
}
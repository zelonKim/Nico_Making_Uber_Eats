import { Field } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/ouput.dto";
import { Category } from "../entities/category.entity";

@ObjectType()
export class AllCategoriesOutput extends CoreOutput {
    @Field(type => [Category], {nullable: true})
    categories?: Category[]
}
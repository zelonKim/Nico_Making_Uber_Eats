import { Field, ObjectType } from '@nestjs/graphql';
import { Category } from 'src/restaurants/entities/category.entity';
import { CoreOutput } from '../../common/dtos/ouput.dto';
import { PaginationInput, PaginationOutput } from './pagination.dto';

@ObjectType()
export class CategoryInput extends PaginationInput {
  @Field((type) => String)
  slug: string;
}

@ObjectType()
export class CategoryOutput extends PaginationOutput {
  @Field((type) => Category, { nullable: true })
  category?: Category;
}

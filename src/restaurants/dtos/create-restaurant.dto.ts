import { InputType, OmitType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/ouput.dto';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class CreateRestaurantInput extends PickType(
  'name',
  'coverImg',
  'address',
) {
  @Field(type => String)
  categoryName: string;
}


@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {}
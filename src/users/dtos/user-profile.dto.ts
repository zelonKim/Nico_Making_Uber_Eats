import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/ouput.dto';

@ArgsType()
export class UserProfileInput {
  @Field((type) => Number)
  userId: number;
}

@ObjectType()
export class UserProfileOutput extends CoreOutput {
  @Field((type) => User, { nullable: true })
  user?: User;
}

import { Field, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/ouput.dto';
import { User } from '../entities/user.entity';

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field((type) => String, { nullable: true })
  token?: string;
}

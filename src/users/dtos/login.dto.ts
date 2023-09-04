import { Field, ObjectType } from '@nestjs/graphql';
import { MutationOuput } from 'src/common/dtos/ouput.dto';
import { User } from '../entities/user.entity';

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class LoginOutput extends MutationOuput {
  @Field((type) => String, { nullable: true })
  token: string;
}

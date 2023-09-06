import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput, MutationOuput } from 'src/common/dtos/ouput.dto';
import { User } from '../entities/user.entity';

@InputType()
export class CreateAccountInput extends PickType(User, [
  'email',
  'password',
  'role',
]) {}

@ObjectType()
export class CreateAccountOuput extends CoreOutput {}

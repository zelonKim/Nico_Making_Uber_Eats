import { CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

import { AllowedRoles } from './role.decorator';
import { Reflector } from '@nestjs/core';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedRoles>( // can get the Metadata thru 'key'
      'roles',
      context.getHandler(), // returns a reference to the handler that will be invoked next in the request pipeline.
    ); // 'roles' variable has a value of the prameter in @Role()

    if (!roles) {// there is no metadata, so anybody can access publically
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context).getContext(); // http 컨텍스트를 graphQL 컨텍스트로 바꿔줌.
    const user: User = gqlContext['user']; 

    if (!user) { 
      return false;
    }

    if (roles.includes('Any')) {  
      return true;
    }

    return roles.includes(user.role); // 특정 role만 접근 가능하도록 함.
}

// if guard returns true, it will goes on.  Otherwise, it will stop

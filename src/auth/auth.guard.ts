

import { CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context).getContext(); // http 컨텍스트를 graphQL 컨텍스트로 바꿔줌.
    const user = gqlContext['user'];
    if (!user) {
      return false;
    }
    return true;
  }
}

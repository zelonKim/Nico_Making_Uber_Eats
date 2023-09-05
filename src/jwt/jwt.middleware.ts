import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { JwtService } from './jwt.service';


/* 
// 클래스 방식 미들웨어
 export class JwtMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log(req.headers);
        next();
    }
}   
*/


/* 
// 함수 방식 미들웨어
export function JwtMiddleware(req: Request, res: Response, next: NextFunction) {
    console.log(req.headers);
    next();
} 
*/


///////////////////


@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}
  
  use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      const decoded = this.jwtService.verify(token.toString());

      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        try {
          const user = await this.userService.findById(decoded['id']);
          req['user'] = user;
        } catch (e) {}
      }
    }
    next();
  }
}

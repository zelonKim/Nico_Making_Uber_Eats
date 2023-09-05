import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from './interfaces/jwt-module-options.interface';
import { CONFIG_OPTIONS } from './interfaces/jwt.configOptions';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {}
  sign(userId: number): string {
    return jwt.sign({ id: userId }, this.options.privateKey); 
  }

  verify(token: string) {
    return jwt.verify(token, this.options.privateKey); // verify(토큰, 비밀키) 메서드를 통해 주어진 토큰을 해독함.
  }
}

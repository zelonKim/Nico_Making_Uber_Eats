import { DynamicModule, Module } from '@nestjs/common';
import { JwtModuleOptions } from 'src/jwt/interfaces/jwt-module-options.interface';
import { CONFIG_OPTIONS } from 'src/jwt/interfaces/jwt.configOptions';
import { JwtService } from 'src/jwt/jwt.service';
import { MailModuleOptions } from './mail.interfaces';
import { MailService } from './mail.service';

@Module({})
@Global()
export class MailModule {
  static forRoot(options: MailModuleOptions): DynamicModule {
    return {
      module: MailModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        MailService,
      ],
      exports: [MailService],
    };
  }
}

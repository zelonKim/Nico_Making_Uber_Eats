import { ApolloDriver } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
      }),
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'prod',
      logging: process.env.NODE_ENV !== 'prod',
      entities: [User],
    }),

    UsersModule,

    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),

    GraphQLModule.forRoot({
      // forRoot()를 통해 root모듈로 설정해줌.
      autoSchemaFile: true,
      driver: ApolloDriver,
      context: ({ req }) => ({ user: req['user'] }), // context 프로퍼티를 통해 익스프레스의 request객체를 받아옴.
    }),

    AuthModule,
  ],

  controllers: [],
  providers: [],
})






export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({
      // exclude({ path:  ,  method:  })를 통해 해당 경로 및 요청에 미들웨어를 제외시켜줄 수도 있음.
      path: '/graphql',
      method: RequestMethod.POST,
    }); // '/graphql' 경로(path)에 POST요청(method)인 경우에만 JwtMiddleware를 적용함.
  }
} // path: '*'과 method: RequestMethod.ALL을 통해  모든 경로 및 요청에 해당 미들웨어를 적용할 수도 있음.

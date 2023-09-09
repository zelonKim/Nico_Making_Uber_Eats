import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest'; // supertest module provides a high-level abstraction for testing HTTP
import { AppModule } from '../src/app.module';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Verification } from 'src/users/entities/verification.entity';

jest.mock('got', () => {
  return {
    post: jest.fn(),
  };
});

const GRAPHQL_ENDPOINT = '/graphql';

const testUser = {
  email: 'ksz1860@naver.com',
  password: '12345',
};

describe('UserModule (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let verificationsRepository: Repository<Verification>;
  let usersRepository: Repository<User>;

  const baseTest = () => request(app.getHttpServer()).post(GRAPHQL_ENDPOINT);
  const publicTest = (query: string) => baseTest().send({ query });
  const privateTest = (query: string) =>
    baseTest().set('X-JWT', jwtToken).send({ query });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();

    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    verificationsRepository = module.get<Repository<Verification>>(
      getRepositoryToken(Verification),
    );

    await app.init();
  });

  afterAll(async () => {
    const dataSource: DataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    const connection: DataSource = await dataSource.initialize(); // 데이터베이스와 연결함.
    await connection.dropDatabase(); // 데이터베이스를 삭제함.
    await connection.destroy(); // 데이터베이스 연결을 해제함.

    app.close(); // 모든 테스트가 끝난 후, app을 종료시켜줘야 함.
  });

  ///////////////////////////

  describe('createAccount', () => {
    const EMAIL = 'ksz1860@naver.com';
    const PASSWORD = '12345';

    it('should create account', () => {
      return publicTest(`
        mutation {
          createAccount(input: {
            email: '${testUser.email}',
            password:'${testUser.password}',
            role: Owner
          }) {
            ok
            error
          }
        }
      `)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(true);
          expect(res.body.data.createAccount.error).toBe(null);
        });
    });

    it('should fail if account already exists', () => {
      return publicTest(`
        mutation {
          createAccount(input: {
            email: '${testUser.email}',
            password:'${testUser.password}',
            role: Owner
          }) {
            ok
            error
          }
        }
      `)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(false);
          expect(res.body.data.createAccount.error).toBe(
            'There is a user with that email already',
          );
        });
    });
  });

  //////////////////////////

  describe('login', () => {
    it('should login with correct credentials', () => {
      return publicTest(`
        mutation {
          login(input: {
            email: '${testUser.email}',
            password:'${testUser.password}',
          }) {
            ok
            error
            token
          }
        }
      `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;
          expect(login.ok).toBe(true);
          expect(login.error).toBe(null);
          expect(login.token).toEqual(expect.any(String));
          jwtToken = login.token;
        });
    });

    it.todo('should not be able to login with wrong credentials', () => {
      return publicTest(`
        mutation {
          login(input: {
            email: '${testUser.email}',
            password:'xxx',
          }) {
            ok
            error
            token
          }
        }
      `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;
          expect(login.ok).toBe(false);
          expect(login.error).toBe('Wrong password');
          expect(login.token).toBe(null);
        });
    });
  });

  /////////////////////////

  describe('userProfile', () => {
    let userId: number;

    beforeAll(async () => {
      const [user] = await usersRepository.find();
      userId = user.id;
    });

    it('should see a user profile', () => {
      return privateTest(`
    {
      userProfile(userId:${userId}) {
        ok
        error
        user {
          id
        }
      }
    }  
  `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                userProfile: {
                  ok,
                  error,
                  user: { id },
                },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(id).toBe(userId);
        });
    });

    it.todo('should not find a profile', () => {
      return privateTest(`
    {
      userProfile(userId:986}) {
        ok,
        error,
        user {
          id
        }
      }
    }  
  `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                userProfile: { ok, error, user },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toBe('User Not Found');
          expect(user).toBe(null);
        });
    });

    //////////////////////////

    describe('me', () => {
      it('should find my profile', () => {
        return privateTest(`
      {
        me {
          email
        }
      }
      `)
          .expect(200)
          .expect((res) => {
            const {
              body: {
                data: {
                  me: { email },
                },
              },
            } = res;
            expect(email).toBe(testUser.email);
          });
      });

      it('should not allow logged out user', () => {
        return publicTest(`
      {
        me {
          email
        }
      }
      `)
          .expect(200)
          .expect((res) => {
            const {
              body: { errors },
            } = res;
            const [error] = errors;
            expect(error.message).toBe('Forbidden resource');
          });
      });
    });

    /////////////////////////

    describe('editProfile', () => {
      const NEW_EMAIL = 'ksz18600@naver.com';

      it('should change email', () => {
        return privateTest(`
        mutation {
          editProfile(input: {
            email: '${NEW_EMAIL}'
          }) {
            ok
            error
          }
        }
      `)
          .expect(200)
          .expect((res) => {
            const {
              body: {
                data: {
                  editProfile: { ok, error },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });

      it('should have new email', () => {
        return privateTest(`
      {
        me {
          email
        }
      }
      `)
          .expect(200)
          .expect((res) => {
            const {
              body: {
                data: {
                  me: { email },
                },
              },
            } = res;
            expect(email).toBe(NEW_EMAIL);
          });
      });
    });

    ////////////////////

    describe('verifyEmail', () => {
      let verificationCode: string;

      beforeAll(async () => {
        const [verification] = await verificationsRepository.find();
        verificationCode = verification.code;
      });

      it('should verify email', () => {
        return publicTest(`
        mutation {
          verifyEmail(input: {
            code: "${verificationCode}"
          }){
            ok
            error
          }
        }
      `)
          .expect(200)
          .expect((res) => {
            const {
              body: {
                data: {
                  verifyEmail: { ok, error },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(error).toBe(null);
          });
      });

      it('sould fail on wrong verification code not found', () => {
        return publicTest(`
        mutation {
          verifyEmail(input: {
            code: "xxxx"
          }){
            ok
            error
          }
        }
      `)
          .expect(200)
          .expect((res) => {
            const {
              body: {
                data: {
                  verifyEmail: { ok, error },
                },
              },
            } = res;
            expect(ok).toBe(false);
            expect(error).toBe('Verification not found');
          });
      });
    });
  });
});

///////////////////////////

/* describe('/movies', () => {
    it('GET', () => {
      return request(app.getHttpServer()).get('/movies').expect(200).expect([]);
    });

    it('POST 201', () => {
      return request(app.getHttpServer())
        .get('/movies')
        .send({
          title: 'Test',
          year: 2000,
          generes: ['test'],
        })
        .expect(201);
    });

    it('POST 400', () => {
      return request(app.getHttpServer())
        .get('/movies')
        .send({
          title: 'Test',
          year: 2000,
          generes: ['test'],
          other: 'thing',
        })
        .expect(400);
    });

    it('DELETE', () => {
      return request(app.getHttpServer()).delete('/movies').expect(404);
    });
  });

  describe('/movies/:id', () => {
    it('GET 200', () => {
      return request(app.getHttpServer()).get('movies/1').expect(200);
    });

    it('GET 404', () => {
      return request(app.getHttpServer()).get('movies/999').expect(404);
    });

    it('PATCH 200', () => {
      return request(app.getHttpServer())
        .patch('/movies/1')
        .send({ title: 'Updated Test' })
        .expect(200);
    });

    it('DELETE 200', () => {
      return request(app.getHttpServer()).delete('/movies/1').expect(200);
    });
  }); */

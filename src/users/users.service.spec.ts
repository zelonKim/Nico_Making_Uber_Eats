import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { UsersService } from './users.service';

import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockRepository = {
  findOne: jest.fn(), // jest.fn()을 통해 가짜(mock)함수를 생성함.
  save: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockMailService = {
  sendVerificationEmail: jest.fn(),
};



// Record<K, T> constructs a type with a set of properties K of type T
type MockRepository<T = any> = Partial<
  Record<keyof Repository<User>, jest.Mock>
>; // jest.Mock을 통해 가짜(mock) 타입을 생성함.


describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: MockRepository<User>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      // Test.createTestingModule()를 통해 테스트 모듈을 생성함.
      providers: [
        UsersService, 
        {
          // getRepositoryToken() generates an injection token for an Entity or Repository
          provide: getRepositoryToken(User), // User엔티티에 주입된 레포지토리의 의존성을 제공함.
          useValue: mockRepository, // User 레포지토리가 호출하는 가짜 함수를 제공함.
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository,
        },

        {
          provide: JwtService, // JwtService의 의존성을 제공함.
          useValue: mockJwtService, // JwtService가 호출하는 가짜 함수를 제공함.
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    usersRepository = module.get(getRepositoryToken(User));

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('createAccount', () => {
    it('should fail if user exists', async () => {
      usersRepository.findOne.mockResolvedValue({ // 비동기 테스트를 할때 async함수를 mock함.
        id: 1,
        email: 'lalala',
      });

      const result = await service.createAccount({
        email: '',
        password: '',
        role: 0,
      });

      expect(result).toMatchObject({
        ok: false,
        error: 'There is a user with that email already',
      });
    });
  });

  it.todo('login');
  it.todo('findById');
  it.todo('editProfile');
  it.todo('verifyEmail');
});

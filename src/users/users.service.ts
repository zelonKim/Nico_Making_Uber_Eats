import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { CreateAccountInput, CreateAccountOuput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';
import { UserProfileOutput } from 'src/users/dtos/user-profile.dto';
import { VerifyEmailOutput } from './dtos/verify-email.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly jwtService: JwtService,
  ) {}


  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOuput> {
    try {
      const exists = await this.users.findOne({ email });
      if (exists) {
        return { ok: false, error: 'There is a user with that email already' };
      }
      const user = await this.users.save(this.users.create({ email, password, role }));
      await this.verifications.save(this.verifications.create({
        user:
      }))
      return { ok: true };
    } catch (e) {
      return { ok: false, error: 'Can not create account' };
    }
  }



  async login({
    email,
    password,
  }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne({ email }, { select: ['password'] }); // select를 통해 해당 필드만 가져옴.
      if (!user) {
        return { ok: false, error: 'User not found' };
      }

      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Wrong password',
        };
      }

      const token = this.jwtService.sign(user.id);
      return {
        ok: true,
        token,
      };
    } 
    catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }


  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOne({ id });
      if(user) {
        return {
          ok: true,
          user,
        }
      }
    } catch (error) {
      return { ok: false, error: 'User Not Found'}
    }
  }


  async editProfile(userId: number, { email, password }: EditProfileInput) {
    const user = await this.users.findOne(userId);
    if (email) {
      user.email = email;
      user.verified = false;
      await this.verifications.save(this.verifications.create({ user }))
    }
    if (password) {
      user.password = password;
    }
    await this.users.save(user);
    return {
      ok: true,
    }
    } catch (error) {
      return { ok: false, error: 'Can not update profile'}
    }



  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verifications.findOne({ code }, { relations: ['user'] }); // relations를 통해 해당 필드의 전체 데이터를 가져옴.
      if(verification) {
        verification.user.verified = true;
        this.users.save(verification.user);
        return { ok: true };
      }
      return { ok: false, error: 'Verification not found'}
    }
    catch(error) {
      return { ok: false, error };
    }
  }

}

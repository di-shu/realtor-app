import { Test, TestingModule } from '@nestjs/testing';
import { AuthService, SigninParams, SignupParams } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UserType } from '@prisma/client';
import { ConflictException, HttpException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const userMock = {
  id: 1,
  name: 'Name',
  phone: '1111',
  email: 'email',
  password: 'string',
  created_at: new Date(),
  updated_at: new Date(),
  user_type: UserType.REALTOR,
};

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn().mockReturnValue(userMock),
              create: jest.fn().mockReturnValue(userMock),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    const signupParams: SignupParams = {
      email: 'email',
      password: 'password',
      phone: '1111',
      name: 'name',
    };

    it('should throw ConflictException if an user already exists', async () => {
      try {
        await service.signup(signupParams, UserType.REALTOR);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
      }
    });

    it('should call user.findUnique with correct payload', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockImplementation(jest.fn().mockReturnValue(null));
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(jest.fn().mockReturnValue(signupParams.password));

      await service.signup(signupParams, UserType.REALTOR);

      expect(prismaService.user.create).toBeCalledWith({
        data: {
          email: signupParams.email,
          password: signupParams.password,
          name: signupParams.name,
          phone: signupParams.phone,
          user_type: UserType.REALTOR,
        },
      });
    });

    it('should call jwt.sign with correct payload', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockImplementation(jest.fn().mockReturnValue(null));

      jest.spyOn(jwt, 'sign').mockImplementation(jest.fn());

      await service.signup(signupParams, UserType.REALTOR);

      expect(jwt.sign).toBeCalledWith(
        {
          name: signupParams.name,
          id: userMock.id,
        },
        process.env.JWT_TOKEN_KEY,
        { expiresIn: 3600000 },
      );
    });
  });

  describe('signin', () => {
    const credentials: SigninParams = {
      email: 'email',
      password: '12345',
    };

    it('should throw HttpException if there is no user', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockImplementation(jest.fn().mockReturnValue(null));

      try {
        await service.signin(credentials);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });

    it('should throw HttpException if password is incorrect', async () => {
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(jest.fn().mockReturnValue(false));

      try {
        await service.signin(credentials);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });

    it('should call jwt.sign with correct payload', async () => {
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(jest.fn().mockReturnValue(true));
      jest.spyOn(jwt, 'sign').mockImplementation(jest.fn());

      await service.signin(credentials);

      expect(jwt.sign).toBeCalledWith(
        {
          name: userMock.name,
          id: userMock.id,
        },
        process.env.JWT_TOKEN_KEY,
        { expiresIn: 3600000 },
      );
    });
  });

  describe('generateProductKey', () => {
    const email = 'email';
    const userType = UserType.REALTOR;

    it('should call bcrypt.hash with correct payload', () => {
      jest.spyOn(bcrypt, 'hash').mockImplementation(jest.fn());

      service.generateProductKey(email, userType);

      expect(bcrypt.hash).toBeCalledWith(
        `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`,
        10,
      );
    });
  });
});

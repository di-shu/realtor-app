import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthService } from './auth.service';
import { UserType } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { GenerateProductKeyDto } from '../dtos/auth.dto';
import { UserInfo } from '../decorators/user.decorator';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            signin: jest.fn(),
            generateProductKey: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    const signupParams = {
      email: 'email',
      password: 'password',
      phone: '1111',
      name: 'name',
    };

    it('should just call authService.signup with correct payload when an user type is BUYER', async () => {
      await controller.signup(UserType.BUYER, signupParams);

      expect(service.signup).toBeCalledWith(signupParams, UserType.BUYER);
    });

    it('should throw UnauthorizedException if there is no productKey on signupParams object', async () => {
      try {
        await controller.signup(UserType.REALTOR, signupParams);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('should call bcrypt.compare with correct payload', async () => {
      const body = {
        ...signupParams,
        productKey: 'key',
      };
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(jest.fn().mockReturnValue(true));

      const validProductKey = `${signupParams.email}-${UserType.REALTOR}-${process.env.PRODUCT_KEY_SECRET}`;
      await controller.signup(UserType.REALTOR, body);

      expect(bcrypt.compare).toBeCalledWith(validProductKey, body.productKey);
    });

    it('should throw UnauthorizedException if a product key invalid', async () => {
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(jest.fn().mockReturnValue(false));
      let err;

      try {
        await controller.signup(UserType.REALTOR, {
          ...signupParams,
          productKey: 'productKey',
        });
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('signin', () => {
    const signinParams = {
      email: 'email',
      password: 'password',
    };

    it('should call authService.signin with correct payload', async () => {
      await controller.signin(signinParams);

      expect(service.signin).toBeCalledWith(signinParams);
    });
  });

  describe('generateProductKey', () => {
    const body: GenerateProductKeyDto = {
      email: 'email',
      userType: UserType.REALTOR,
    };

    it('should call authService.generateProductKey with correct payload', () => {
      controller.generateProductKey(body);
      expect(service.generateProductKey).toBeCalledWith(
        body.email,
        body.userType,
      );
    });
  });

  describe('me', () => {
    const user: UserInfo = {
      name: 'name',
      id: 1,
      iat: 100,
      exp: 200,
    };

    it('should return user with type UserInfo', () => {
      expect(controller.me(user)).toEqual(user);
    });
  });
});

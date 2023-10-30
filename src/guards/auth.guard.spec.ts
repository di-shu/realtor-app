import { Reflector } from '@nestjs/core';
import { AuthGuard, JWTUserPayload } from './auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import * as httpMock from 'node-mocks-http';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

const userMock = {
  id: 1,
  name: 'Name',
  phone: '1111',
  email: 'email',
  password: 'string',
  created_at: new Date(),
  updated_at: new Date(),
  user_type: UserType.ADMIN,
};

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let reflector: Reflector;
  let prismaService: PrismaService;
  let executionContext: ExecutionContext;
  const payload: JWTUserPayload = {
    id: 1,
    name: 'name',
    exp: 200,
    iat: 100,
  };

  beforeEach(() => {
    reflector = new Reflector();
    prismaService = new PrismaService();
    executionContext = createMock<ExecutionContext>();
    authGuard = new AuthGuard(reflector, prismaService);
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  it('should return true if no role provided', async () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockImplementation(jest.fn().mockReturnValue([]));

    expect(await authGuard.canActivate(executionContext)).toBe(true);
  });

  it('should return false if no user found and roles provided', async () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockImplementation(jest.fn().mockReturnValue(['ADMIN']));

    jest.spyOn(executionContext, 'switchToHttp').mockImplementation(
      jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(
          httpMock.createRequest({
            headers: {
              authorization: 'Bearer eyJhbGciOiJ',
            },
          }),
        ),
      }),
    );
    jest
      .spyOn(jwt, 'verify')
      .mockImplementation(jest.fn().mockReturnValue(payload));
    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockImplementation(jest.fn().mockReturnValue(null));

    expect(await authGuard.canActivate(executionContext)).toBe(false);
  });

  it('should return true if user found and roles includes an user role', async () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockImplementation(jest.fn().mockReturnValue(['ADMIN']));

    jest.spyOn(executionContext, 'switchToHttp').mockImplementation(
      jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(
          httpMock.createRequest({
            headers: {
              authorization: 'Bearer eyJhbGciOiJ',
            },
          }),
        ),
      }),
    );
    jest
      .spyOn(jwt, 'verify')
      .mockImplementation(jest.fn().mockReturnValue(payload));
    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockImplementation(jest.fn().mockReturnValue(userMock));

    expect(await authGuard.canActivate(executionContext)).toBe(true);
  });

  it('should return false when error is being catched', async () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockImplementation(jest.fn().mockReturnValue(['ADMIN']));

    jest.spyOn(executionContext, 'switchToHttp').mockImplementation(
      jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(
          httpMock.createRequest({
            headers: {
              authorization: 'Bearer eyJhbGciOiJ',
            },
          }),
        ),
      }),
    );

    jest.spyOn(jwt, 'verify').mockImplementation(
      jest.fn(() => {
        throw new Error();
      }),
    );

    expect(await authGuard.canActivate(executionContext)).toBe(false);
  });
});

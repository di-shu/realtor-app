import { UserInterceptor } from './user.interceptor';
import { createMock } from '@golevelup/ts-jest';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import * as httpMock from 'node-mocks-http';
import * as jwt from 'jsonwebtoken';

describe('UserInterceptor', () => {
  const token = 'eyJhbGciOiJ';
  let userInterceptor: UserInterceptor;
  let executionContext: ExecutionContext;
  let next: CallHandler;

  beforeEach(() => {
    userInterceptor = new UserInterceptor();
    executionContext = createMock<ExecutionContext>();
    next = {
      handle: jest.fn(),
    };

    jest.spyOn(executionContext, 'switchToHttp').mockImplementation(
      jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(
          httpMock.createRequest({
            headers: {
              authorization: `Bearer ${token}`,
            },
          }),
        ),
      }),
    );

    jest
      .spyOn(jwt, 'decode')
      .mockImplementation(jest.fn().mockReturnValue(token));
  });

  it('should call jwt.decode with correct payload', () => {
    userInterceptor.intercept(executionContext, next);

    expect(jwt.decode).toBeCalledWith(token);
  });

  it('should call next.handle', async () => {
    jest
      .spyOn(next, 'handle')
      .mockImplementation(jest.fn().mockReturnValue(true));
    expect(await userInterceptor.intercept(executionContext, next)).toBe(true);
  });
});

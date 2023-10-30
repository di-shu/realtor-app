import { PrismaService } from '../prisma/prisma.service';
import { EmailSaverMiddleware } from './emailSaver.middleware';
import * as httpMock from 'node-mocks-http';

describe('EmailSaverMiddleware', () => {
  let middleware: EmailSaverMiddleware;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = new PrismaService();
    middleware = new EmailSaverMiddleware(prismaService);
  });

  it('should call prismaService.email.create with correct payload if res.statusCode is 200 and email provided', async () => {
    const res = httpMock.createResponse();
    const req = httpMock.createRequest({ body: { email: 'email' } });
    const next = jest.fn();

    jest.spyOn(prismaService.email, 'create').mockImplementation(jest.fn());

    await middleware.use(req, res, next);

    expect(prismaService.email.create).toBeCalledWith({
      data: {
        email: req.body.email,
      },
    });
  });
});

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailSaverMiddleware implements NestMiddleware {
  constructor(private readonly prismaService: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (res.statusCode === 200) {
      const { email } = req.body;
      if (email) {
        await this.prismaService.email.create({
          data: {
            email,
          },
        });
      }
    }
    next();
  }
}

import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseEnumPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, SigninDto, GenerateProductKeyDto } from '../dtos/auth.dto';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { User, UserInfo } from '../../user/decorators/user.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup/:userType')
  @ApiQuery({ name: 'userType', enum: UserType })
  @ApiBody({ type: SignupDto })
  @ApiOperation({
    description: 'Register an user',
  })
  @ApiResponse({ status: 200, description: 'Ok' })
  async signup(
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
    @Body() body: SignupDto,
  ) {
    if (userType !== UserType.BUYER) {
      if (!body.productKey) {
        throw new UnauthorizedException();
      }

      const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
      const isValidProductKey = await bcrypt.compare(
        validProductKey,
        body.productKey,
      );

      if (!isValidProductKey) {
        throw new UnauthorizedException();
      }
    }

    return this.authService.signup(body, userType);
  }

  @Post('/signin')
  @ApiBody({ type: SignupDto })
  @ApiOperation({ description: 'Signin' })
  @ApiResponse({ status: 201, description: 'Signed in' })
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

  @Roles(UserType.ADMIN)
  @Post('/key')
  @ApiBody({ type: GenerateProductKeyDto })
  @ApiOperation({ description: 'Generate a product key' })
  @ApiResponse({ status: 201, description: 'A product key generated' })
  generateProductKey(@Body() { userType, email }: GenerateProductKeyDto) {
    return this.authService.generateProductKey(email, userType);
  }

  @Get('/me')
  @ApiOperation({ description: 'Return a current user' })
  @ApiResponse({ status: 200, description: 'Ok' })
  me(@User() user: UserInfo) {
    return user;
  }
}

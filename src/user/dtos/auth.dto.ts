import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: 'phone must be a valid phone number',
  })
  @ApiProperty({ default: '+38012345678' })
  phone: string;

  @IsEmail()
  @ApiProperty({ default: 'email@mail.com' })
  email: string;

  @IsString()
  @MinLength(5)
  @ApiProperty({ minLength: 5 })
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  productKey?: string;
}

export class SigninDto {
  @IsEmail()
  @ApiProperty({ default: 'email@mail.com' })
  email: string;

  @IsString()
  @ApiProperty()
  password: string;
}

export class GenerateProductKeyDto {
  @IsEmail()
  @ApiProperty({ default: 'email@mail.com' })
  email: string;

  @IsEnum(UserType)
  @ApiProperty({ enum: UserType })
  userType: UserType;
}

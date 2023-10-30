import { ApiProperty } from '@nestjs/swagger';
import { PropertyType } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class HomeResponseDto {
  id: number;
  address: string;
  image: string;

  @Exclude()
  num_of_bedrooms: number;
  @Expose({ name: 'numberOfBedrooms' })
  numberOfBedrooms() {
    return this.num_of_bedrooms;
  }

  @Exclude()
  num_of_bathrooms: number;
  @Expose({ name: 'numberOfBathrooms' })
  numberOfBathrooms() {
    return this.num_of_bathrooms;
  }

  city: string;

  @Exclude()
  listed_date: Date;
  @Expose({ name: 'listedDate' })
  listedDate() {
    return this.listed_date;
  }

  price: number;

  @Exclude()
  land_size: number;
  @Expose({ name: 'landSize' })
  landSize() {
    return this.land_size;
  }

  propertyType: PropertyType;

  @Exclude()
  created_at: Date;
  @Exclude()
  updated_at: Date;
  @Exclude()
  realtor_id: number;

  constructor(partial: Partial<HomeResponseDto>) {
    Object.assign(this, partial);
  }
}

export class Image {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  url: string;
}

export class CreateHomeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  address: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty()
  numberOfBedrooms: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty()
  numberOfBathrooms: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  city: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty()
  price: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty()
  land_size: number;

  @IsEnum(PropertyType)
  @ApiProperty({ enum: PropertyType })
  propertyType: PropertyType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  @ApiProperty({ type: [Image] })
  images: Image[];
}

export class UpdateHomeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  address?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty({ required: false })
  numberOfBedrooms?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty({ required: false })
  numberOfBathrooms?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  city?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty({ required: false })
  price?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty({ required: false })
  land_size?: number;

  @IsOptional()
  @IsEnum(PropertyType)
  @ApiProperty({ enum: PropertyType, required: false })
  propertyType?: PropertyType;
}

export class InquireDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Hello, docs' })
  message: string;
}

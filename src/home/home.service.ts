import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HomeResponseDto, Image } from './dto/home.dto';
import { PropertyType } from '@prisma/client';
import { UserInfo } from '../user/decorators/user.decorator';

interface homesParams {
  city?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  propertyType?: PropertyType;
}

interface createHomeParams {
  address: string;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  city: string;
  price: number;
  land_size: number;
  propertyType: PropertyType;
  images: Image[];
}

export interface updateHomeParams {
  address?: string;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  city?: string;
  price?: number;
  land_size?: number;
  propertyType?: PropertyType;
}

export interface RealtorResponse {
  name: string;
  id: number;
  email: string;
  phone: string;
}

export interface MessageResponse {
  id: number;
  message: string;
  created_at: Date;
  updated_at: Date;
  home_id: number;
  realtor_id: number;
  buyer_id: number;
}

export interface MessageWithBuyer {
  message: string;
  buyer: {
    name: string;
    phone: string;
    email: string;
  };
}

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHomes(filter: homesParams): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        property_type: true,
        num_of_bathrooms: true,
        num_of_bedrooms: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      where: filter,
    });

    if (!homes.length) {
      throw new NotFoundException();
    }

    return homes.map(
      (home) => new HomeResponseDto({ ...home, image: home.images[0]?.url }),
    );
  }

  async getHomeById(id: number): Promise<HomeResponseDto> {
    const home = await this.prismaService.home.findUnique({ where: { id } });

    if (!home) {
      throw new NotFoundException();
    }

    return new HomeResponseDto(home);
  }

  async createHome(
    {
      address,
      numberOfBathrooms,
      numberOfBedrooms,
      city,
      land_size,
      price,
      propertyType,
      images,
    }: createHomeParams,
    userId: number,
  ) {
    const home = await this.prismaService.home.create({
      data: {
        address,
        num_of_bathrooms: numberOfBathrooms,
        num_of_bedrooms: numberOfBedrooms,
        city,
        land_size,
        property_type: propertyType,
        price,
        realtor_id: userId,
      },
    });
    await this.prismaService.image.createMany({
      data: images.map((image) => ({ ...image, home_id: home.id })),
    });

    return new HomeResponseDto(home);
  }

  async updateHomeById(id: number, data: updateHomeParams) {
    const home = await this.prismaService.home.findUnique({ where: { id } });

    if (!home) {
      throw new NotFoundException();
    }

    const updatedHome = await this.prismaService.home.update({
      where: { id },
      data,
    });

    return new HomeResponseDto(updatedHome);
  }

  async deleteHomeById(id: number) {
    await this.prismaService.image.deleteMany({ where: { home_id: id } });
    await this.prismaService.home.delete({ where: { id } });
  }

  async getRealtorByHomeId(id: number): Promise<RealtorResponse> {
    const home = await this.prismaService.home.findUnique({
      where: { id },
      select: {
        realtor: {
          select: {
            name: true,
            id: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!home?.realtor) {
      throw new NotFoundException();
    }

    return home.realtor;
  }

  async inquire(
    buyer: UserInfo,
    homeId: number,
    message: string,
  ): Promise<MessageResponse> {
    const realtor = await this.getRealtorByHomeId(homeId);

    const newMessage = await this.prismaService.message.create({
      data: {
        realtor_id: realtor.id,
        buyer_id: buyer.id,
        home_id: homeId,
        message,
      },
    });
    return newMessage;
  }

  getMessagesByHome(id: number): Promise<MessageWithBuyer[]> {
    return this.prismaService.message.findMany({
      where: { home_id: id },
      select: {
        message: true,
        buyer: {
          select: { name: true, phone: true, email: true },
        },
      },
    });
  }
}

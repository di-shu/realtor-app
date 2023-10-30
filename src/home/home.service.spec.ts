import { Test, TestingModule } from '@nestjs/testing';
import {
  HomeService,
  MessageResponse,
  RealtorResponse,
  updateHomeParams,
} from './home.service';
import { PrismaService } from '../prisma/prisma.service';
import { PropertyType } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { HomeResponseDto } from './dto/home.dto';
import { UserInfo } from '../user/decorators/user.decorator';

const mockGetHomes = [
  {
    id: 5,
    address: 'Test 111, USA',
    num_of_bedrooms: 2,
    num_of_bathrooms: 1,
    city: 'New York',
    price: 521000,
    property_type: PropertyType.CONDO,
    listed_date: new Date(),
    land_size: 80,
    images: [
      {
        url: 'src',
      },
    ],
  },
];

const mockHome = {
  id: 5,
  address: 'Test 111, USA',
  num_of_bedrooms: 2,
  num_of_bathrooms: 1,
  city: 'New York',
  price: 521000,
  property_type: PropertyType.CONDO,
  listed_date: new Date(),
  land_size: 80,
};

const mockMessage: MessageResponse = {
  id: 1,
  message: 'message',
  created_at: new Date(),
  updated_at: new Date(),
  home_id: 1,
  realtor_id: 1,
  buyer_id: 1,
};

const mockImages = [
  {
    id: 1,
    url: 'src',
  },
  {
    id: 2,
    url: 'src2',
  },
];

describe('HomeService', () => {
  let service: HomeService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeService,
        {
          provide: PrismaService,
          useValue: {
            home: {
              findMany: jest.fn().mockReturnValue(mockGetHomes),
              create: jest.fn().mockReturnValue(mockHome),
              findUnique: jest.fn().mockReturnValue(mockHome),
              update: jest.fn().mockReturnValue(mockHome),
              delete: jest.fn(),
            },
            image: {
              createMany: jest.fn().mockReturnValue(mockImages),
              deleteMany: jest.fn(),
            },
            message: {
              create: jest.fn().mockReturnValue(mockMessage),
              findMany: jest.fn().mockReturnValue([mockMessage]),
            },
          },
        },
      ],
    }).compile();

    service = module.get<HomeService>(HomeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getHomes', () => {
    const filters = {
      city: 'Toronto',
      price: {
        gte: 1000000,
        lte: 1500000,
      },
      propertyType: PropertyType.RESIDENTAL,
    };

    it('should call prisma with correct params', async () => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue(mockGetHomes);
      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);

      await service.getHomes(filters);
      expect(mockPrismaFindManyHomes).toBeCalledWith({
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
        where: filters,
      });
    });

    it('should throw not found exception if no home is found', async () => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue([]);
      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);

      await expect(service.getHomes(filters)).rejects.toThrowError();
    });
  });

  describe('createHome', () => {
    const mockCreateHomeParams = {
      address: '111 Yellow Str',
      numberOfBathrooms: 2,
      numberOfBedrooms: 2,
      city: 'Vancouver',
      land_size: 444,
      price: 3000000,
      propertyType: PropertyType.RESIDENTAL,
      images: [
        {
          url: 'src1',
        },
      ],
    };

    it('should call prisma home.create with correct payload', async () => {
      const mockCreateHome = jest.fn().mockReturnValue(mockHome);

      jest
        .spyOn(prismaService.home, 'create')
        .mockImplementation(mockCreateHome);

      await service.createHome(mockCreateHomeParams, 5);

      expect(mockCreateHome).toBeCalledWith({
        data: {
          address: '111 Yellow Str',
          num_of_bathrooms: 2,
          num_of_bedrooms: 2,
          city: 'Vancouver',
          land_size: 444,
          price: 3000000,
          property_type: PropertyType.RESIDENTAL,
          realtor_id: 5,
        },
      });
    });

    it('should call prisma image.createMany with correct payload', async () => {
      const mockCreateManyImages = jest.fn().mockReturnValue(mockImages);

      jest
        .spyOn(prismaService.image, 'createMany')
        .mockImplementation(mockCreateManyImages);

      await service.createHome(mockCreateHomeParams, 5);
      expect(mockCreateManyImages).toBeCalledWith({
        data: [
          {
            url: 'src1',
            home_id: mockHome.id,
          },
        ],
      });
    });
  });

  describe('getHomeById', () => {
    it('should call prismaService.home.findUnique with correct payload', async () => {
      const mockFindUnique = jest.fn().mockReturnValue(mockHome);

      jest
        .spyOn(prismaService.home, 'findUnique')
        .mockImplementation(mockFindUnique);

      await service.getHomeById(mockHome.id);
      expect(mockFindUnique).toBeCalledWith({ where: { id: mockHome.id } });
    });
  });

  describe('updateHomeById', () => {
    const updateHomePayload: updateHomeParams = {
      address: 'Test',
    };

    it('should throw NotFoundException if no home found with provided id', async () => {
      const mockFindUnique = jest.fn().mockReturnValue(null);

      jest
        .spyOn(prismaService.home, 'findUnique')
        .mockImplementation(mockFindUnique);

      try {
        await service.updateHomeById(1, updateHomePayload);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should call prismaService.home.update with correct payload', async () => {
      const mockFindUnique = jest.fn().mockReturnValue(mockHome);
      const mockUpdate = jest.fn().mockReturnValue(mockHome);

      jest
        .spyOn(prismaService.home, 'findUnique')
        .mockImplementation(mockFindUnique);

      jest.spyOn(prismaService.home, 'update').mockImplementation(mockUpdate);

      await service.updateHomeById(1, updateHomePayload);

      expect(mockUpdate).toBeCalledWith({
        where: { id: 1 },
        data: { ...updateHomePayload },
      });
    });

    it('should return HomeResponseDto object', async () => {
      expect(await service.updateHomeById(1, updateHomePayload)).toEqual(
        new HomeResponseDto(mockHome),
      );
    });
  });

  describe('deleteHomeById', () => {
    it('should call both image.deleteMany and home.delete with correct payloads', async () => {
      const homeId = 1;
      await service.deleteHomeById(1);
      expect(prismaService.image.deleteMany).toBeCalledWith({
        where: { home_id: homeId },
      });
      expect(prismaService.home.delete).toBeCalledWith({
        where: { id: homeId },
      });
    });
  });

  describe('getRealtorByHomeId', () => {
    const homeId = 1;
    const realtor: RealtorResponse = {
      id: 1,
      name: 'Name',
      email: 'email',
      phone: '1111',
    };

    it('should call home.findUnique with correct payload', async () => {
      const mockFindUnique = jest
        .fn()
        .mockReturnValue({ ...mockHome, realtor });

      jest
        .spyOn(prismaService.home, 'findUnique')
        .mockImplementation(mockFindUnique);

      await service.getRealtorByHomeId(homeId);

      expect(prismaService.home.findUnique).toBeCalledWith({
        where: { id: homeId },
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
    });

    it('should throw NotFoundException if no home found or there is no realtor on home object', async () => {
      const mockFindUnique = jest.fn().mockReturnValue(mockHome);

      jest
        .spyOn(prismaService.home, 'findUnique')
        .mockImplementation(mockFindUnique);

      try {
        await service.getRealtorByHomeId(homeId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should return realtor object with type RealtorResponse', async () => {
      const mockFindUnique = jest
        .fn()
        .mockReturnValue({ ...mockHome, realtor });

      jest
        .spyOn(prismaService.home, 'findUnique')
        .mockImplementation(mockFindUnique);

      expect(await service.getRealtorByHomeId(homeId)).toEqual(realtor);
    });
  });

  describe('inquire', () => {
    const homeId = 1;
    const realtor: RealtorResponse = {
      id: 1,
      name: 'Name',
      email: 'email',
      phone: '1111',
    };
    const buyer: UserInfo = {
      id: 1,
      name: 'User',
      iat: 200,
      exp: 300,
    };
    const message = 'message';

    beforeEach(() => {
      jest
        .spyOn(service, 'getRealtorByHomeId')
        .mockImplementation(jest.fn().mockReturnValue(realtor));
    });

    it('should call message.create with correct payload', async () => {
      await service.inquire(buyer, homeId, message);

      expect(prismaService.message.create).toBeCalledWith({
        data: {
          realtor_id: realtor.id,
          buyer_id: buyer.id,
          home_id: homeId,
          message,
        },
      });
    });

    it('should return a message with type MessageResponse', async () => {
      expect(await service.inquire(buyer, homeId, message)).toEqual(
        mockMessage,
      );
    });
  });

  describe('getMessagesByHome', () => {
    const homeId = 1;
    const buyer = {
      name: 'User',
      iat: 200,
      exp: 300,
    };

    beforeEach(() => {
      jest
        .spyOn(prismaService.message, 'findMany')
        .mockImplementation(
          jest.fn().mockReturnValue({ message: mockMessage, buyer }),
        );
    });

    it('should call message.findMany with correct payload', async () => {
      await service.getMessagesByHome(homeId);

      expect(prismaService.message.findMany).toBeCalledWith({
        where: { home_id: homeId },
        select: {
          message: true,
          buyer: {
            select: { name: true, phone: true, email: true },
          },
        },
      });
    });

    it('should return message with type MessageWithBuyer', async () => {
      expect(await service.getMessagesByHome(homeId)).toEqual({
        message: mockMessage,
        buyer,
      });
    });
  });
});

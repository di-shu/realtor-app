import { Test, TestingModule } from '@nestjs/testing';
import { HomeController } from './home.controller';
import {
  HomeService,
  MessageResponse,
  MessageWithBuyer,
  RealtorResponse,
} from './home.service';
import { HomeResponseDto, InquireDto } from './dto/home.dto';
import { PrismaModule } from '../prisma/prisma.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
  ClassSerializerInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { UserInfo } from '../user/decorators/user.decorator';

describe('HomeController', () => {
  let controller: HomeController;
  let service: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [HomeController],
      providers: [
        HomeService,
        { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
      ],
    }).compile();

    service = module.get<HomeService>(HomeService);
    controller = module.get<HomeController>(HomeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getHomes', () => {
    it('should return array of all homes', async () => {
      const homes = [
        {
          id: 1,
          address: 'Test 111, USA',
          city: 'New York',
          price: 500000,
          property_type: 'CONDO',
          num_of_bathrooms: 1,
          num_of_bedrooms: 2,
          images: [
            {
              url: 'img11',
            },
          ],
          image: 'img11',
        },
      ];

      jest.spyOn(service, 'getHomes').mockImplementation(async () => {
        const result: any = await new Promise((resolve) => {
          resolve(homes);
        });

        return result.map((home) => new HomeResponseDto(home));
      });

      expect(await controller.getHomes()).toEqual(homes);
    });

    it('should call service.getHomes with correct payload', async () => {
      const minPrice = '100';
      const maxPrice = '300';
      const city = 'City';
      const propertyType = PropertyType.CONDO;
      const expectedPayload = {
        price: {
          gte: parseFloat(minPrice),
          lte: parseFloat(maxPrice),
        },
        city,
        propertyType,
      };
      jest.spyOn(service, 'getHomes').mockImplementation(jest.fn());
      await controller.getHomes(city, minPrice, maxPrice, propertyType);

      expect(service.getHomes).toBeCalledWith(expectedPayload);
    });
  });

  describe('getHomeById', () => {
    it('should return a home by id', async () => {
      const home = {
        id: 1,
        address: 'Test 111, USA',
        num_of_bedrooms: 2,
        num_of_bathrooms: 1,
        city: 'New York',
        price: 500000,
        property_type: 'CONDO',
        land_size: 80,
      };

      jest.spyOn(service, 'getHomeById').mockImplementation(async () => {
        const result = await new Promise((resolve) => {
          resolve(home);
        });

        return new HomeResponseDto(result);
      });

      expect(await controller.getHomeById(1)).toEqual(home);
    });
  });

  describe('createHome', () => {
    it('should return new home', async () => {
      const body = {
        address: 'Test 111, USA',
        numberOfBedrooms: 2,
        numberOfBathrooms: 1,
        city: 'New York',
        price: 500000,
        propertyType: PropertyType.CONDO,
        land_size: 80,
        images: [{ url: '1' }],
      };
      const user = {
        name: 'Name',
        id: 1,
        iat: 100,
        exp: 200,
      };
      const result = {
        id: 12,
        ...body,
      };

      jest.spyOn(service, 'createHome').mockImplementation(async () => {
        const data = await new Promise((resolve) => {
          resolve({ id: 12, ...body });
        });

        return new HomeResponseDto(data);
      });

      expect(await controller.createHome(body, user)).toEqual(result);
    });
  });

  describe('updateHomeById', () => {
    it("should return updated home if an user's id is equal to a realtor's id", async () => {
      const homeId = 1;
      const realtor: RealtorResponse = {
        id: 1,
        name: 'Name',
        phone: '1111',
        email: 'test@gmail',
      };
      const body = {
        address: 'Test 111, USA',
        numberOfBedrooms: 2,
        numberOfBathrooms: 1,
        city: 'New York',
        price: 500000,
        propertyType: PropertyType.CONDO,
        land_size: 80,
        images: [{ url: '1' }],
      };
      const user: UserInfo = {
        name: 'Name',
        id: 1,
        iat: 100,
        exp: 200,
      };
      const result = {
        id: 12,
        ...body,
      };

      jest.spyOn(service, 'getRealtorByHomeId').mockImplementation(async () => {
        const data: RealtorResponse = await new Promise((resolve) => {
          resolve(realtor);
        });

        return data;
      });

      jest.spyOn(service, 'updateHomeById').mockImplementation(async () => {
        const data = await new Promise((resolve) => {
          resolve(result);
        });

        return new HomeResponseDto(data);
      });

      expect(await controller.updateHomeById(homeId, body, user)).toEqual(
        result,
      );
    });

    it("should throw exception if an user's id isn't equal to a realtor's id", async () => {
      const homeId = 1;
      const realtor: RealtorResponse = {
        id: 4,
        name: 'Name',
        phone: '1111',
        email: 'test@gmail',
      };
      const body = {
        address: 'Test 111, USA',
        numberOfBedrooms: 2,
        numberOfBathrooms: 1,
        city: 'New York',
        price: 500000,
        propertyType: PropertyType.CONDO,
        land_size: 80,
        images: [{ url: '1' }],
      };
      const user: UserInfo = {
        name: 'Name',
        id: 1,
        iat: 100,
        exp: 200,
      };
      const result = {
        id: 12,
        ...body,
      };

      jest.spyOn(service, 'getRealtorByHomeId').mockImplementation(async () => {
        const data: RealtorResponse = await new Promise((resolve) => {
          resolve(realtor);
        });

        return data;
      });

      jest.spyOn(service, 'updateHomeById').mockImplementation(async () => {
        const data = await new Promise((resolve) => {
          resolve(result);
        });

        return new HomeResponseDto(data);
      });

      try {
        await controller.updateHomeById(homeId, body, user);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe('deleteHome', () => {
    it("should call deleteHomeById from HomeService with home's id", async () => {
      const homeId = 1;
      const deleteHomeByIdSpy = jest
        .spyOn(service, 'deleteHomeById')
        .mockImplementation(async () => {
          return await new Promise((resolve) => {
            resolve();
          });
        });

      await controller.deleteHome(homeId);
      expect(deleteHomeByIdSpy).toBeCalledWith(homeId);
    });
  });

  describe('inquire', () => {
    it('should call inquire method from HomeService with correct params', async () => {
      const homeId = 1;
      const user: UserInfo = {
        name: 'Name',
        id: 1,
        iat: 100,
        exp: 200,
      };
      const body: InquireDto = {
        message: 'message',
      };
      const messageResponse: MessageResponse = {
        id: 1,
        message: body.message,
        created_at: new Date(),
        updated_at: new Date(),
        home_id: homeId,
        realtor_id: 1,
        buyer_id: user.id,
      };

      const inquireSpy = jest
        .spyOn(service, 'inquire')
        .mockImplementation(async () => messageResponse);

      await controller.inquire(homeId, user, body);
      expect(inquireSpy).toBeCalledWith(user, homeId, body.message);
    });
  });

  describe('getHomeMessages', () => {
    it("it should return messages by home's id", async () => {
      const homeId = 1;
      const realtor: RealtorResponse = {
        id: 1,
        name: 'Name',
        phone: '1111',
        email: 'test@gmail',
      };
      const user: UserInfo = {
        name: 'Name',
        id: 1,
        iat: 100,
        exp: 200,
      };
      const messages: MessageWithBuyer[] = [
        {
          message: 'message',
          buyer: {
            name: 'Name',
            phone: '1111',
            email: 'test@gmail',
          },
        },
      ];

      jest.spyOn(service, 'getRealtorByHomeId').mockImplementation(async () => {
        const data: RealtorResponse = await new Promise((resolve) => {
          resolve(realtor);
        });

        return data;
      });

      jest.spyOn(service, 'getMessagesByHome').mockImplementation(async () => {
        const data: MessageWithBuyer[] = await new Promise((resolve) => {
          resolve(messages);
        });

        return data;
      });

      expect(await controller.getHomeMessages(homeId, user)).toEqual(messages);
    });

    it("should throw UnauthorizedException if an user's id matches a realtor's id", async () => {
      const homeId = 1;
      const realtor: RealtorResponse = {
        id: 4,
        name: 'Name2',
        phone: '1111',
        email: 'test@gmail',
      };
      const user: UserInfo = {
        name: 'Name',
        id: 1,
        iat: 100,
        exp: 200,
      };
      const messages: MessageWithBuyer[] = [
        {
          message: 'message',
          buyer: {
            name: 'Name',
            phone: '1111',
            email: 'test@gmail',
          },
        },
      ];

      jest.spyOn(service, 'getRealtorByHomeId').mockImplementation(async () => {
        const data: RealtorResponse = await new Promise((resolve) => {
          resolve(realtor);
        });

        return data;
      });

      jest.spyOn(service, 'getMessagesByHome').mockImplementation(async () => {
        const data: MessageWithBuyer[] = await new Promise((resolve) => {
          resolve(messages);
        });

        return data;
      });

      try {
        await controller.getHomeMessages(homeId, user);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});

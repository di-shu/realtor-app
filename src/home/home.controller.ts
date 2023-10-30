import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Param,
  Body,
  ParseIntPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { HomeService } from './home.service';
import {
  CreateHomeDto,
  HomeResponseDto,
  InquireDto,
  UpdateHomeDto,
} from './dto/home.dto';
import { PropertyType, UserType } from '@prisma/client';
import { User, UserInfo } from '../user/decorators/user.decorator';
import { Roles } from '../decorators/roles.decorator';
import { LoggerDecorator } from '../user/decorators/logger.decorator';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  @ApiQuery({ name: 'city', type: String, required: false })
  @ApiQuery({ name: 'minPrice', type: String, required: false })
  @ApiQuery({ name: 'maxPrice', type: String, required: false })
  @ApiQuery({ name: 'propertyType', type: String, required: false })
  @ApiOperation({ description: 'Return homes with applied filters' })
  @ApiResponse({ status: 200, description: 'Homes are found' })
  async getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<HomeResponseDto[]> {
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;

    const filters = {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { propertyType }),
    };

    return this.homeService.getHomes(filters);
  }

  @Roles(UserType.REALTOR)
  @Get(':id')
  @ApiQuery({ name: 'id', type: String, required: false })
  @LoggerDecorator()
  @ApiOperation({ description: 'Return a home by id' })
  @ApiResponse({ status: 200, description: 'A home is found' })
  getHomeById(@Param('id') id: number): Promise<HomeResponseDto> {
    return this.homeService.getHomeById(id);
  }

  @Roles(UserType.REALTOR)
  @Post()
  @ApiBody({ type: CreateHomeDto })
  @ApiOperation({ description: 'Create a home' })
  @ApiResponse({ status: 201, description: 'A home is created' })
  createHome(@Body() body: CreateHomeDto, @User() user: UserInfo) {
    return this.homeService.createHome(body, user.id);
  }

  @Roles(UserType.REALTOR)
  @Put(':id')
  @ApiOperation({ description: 'Update a home by id' })
  @ApiResponse({ status: 200, description: 'A home is updated' })
  async updateHomeById(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDto,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);

    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }

    return this.homeService.updateHomeById(id, body);
  }

  @Roles(UserType.REALTOR)
  // @UseGuards(AuthGuard)
  @ApiOperation({ description: 'Delete a home by id' })
  @ApiResponse({ status: 200, description: 'A home is deleted' })
  @Delete(':id')
  deleteHome(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.deleteHomeById(id);
  }

  @Roles(UserType.BUYER)
  @Post('/inquire/:id')
  @ApiOperation({
    description: 'Create a message related to appropriate user and home',
  })
  @ApiResponse({ status: 201, description: 'A message is created' })
  inquire(
    @Param('id', ParseIntPipe) homeId: number,
    @User() user: UserInfo,
    @Body() { message }: InquireDto,
  ) {
    return this.homeService.inquire(user, homeId, message);
  }

  @Roles(UserType.REALTOR)
  @Get('/:id/messages')
  @ApiOperation({ description: 'Return messages related to some user' })
  @ApiResponse({ status: 200, description: 'A message is returned' })
  async getHomeMessages(
    @Param('id', ParseIntPipe) homeId: number,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(homeId);

    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.homeService.getMessagesByHome(homeId);
  }
}

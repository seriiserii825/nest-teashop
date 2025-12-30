import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  CustomApiBadRequestResponse,
  CustomApiNotFoundResponse,
  CustomApiUnauthorizedResponse,
} from 'src/common/decorators/api-responses.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetStoreDto } from './dto/get-store.dto';

@Auth()
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@CustomApiUnauthorizedResponse()
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @CustomApiBadRequestResponse('Store with this title already exists')
  @ApiBody({ type: CreateStoreDto })
  @ApiResponse({
    status: 201,
    description: 'Store created successfully',
    type: GetStoreDto,
  })
  @Post()
  create(
    @CurrentUser('id') user_id: string,
    @Body() createStoreDto: CreateStoreDto,
  ) {
    return this.storeService.create(user_id, createStoreDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of all stores',
    type: [GetStoreDto],
  })
  findAll() {
    return this.storeService.findAll();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'Store unique identifier',
    example: 'c132ab4e-14a0-45be-9806-d661e09063d0',
  })
  @ApiResponse({
    status: 200,
    description: 'Store details',
    type: GetStoreDto,
  })
  findOne(@CurrentUser('id') user_id: string, @Param('id') store_id: string) {
    return this.storeService.findById(store_id, user_id);
  }

  @ApiParam({
    name: 'id',
    description: 'Store unique identifier',
    example: 'c132ab4e-14a0-45be-9806-d661e09063d0',
  })
  @ApiBody({ type: UpdateStoreDto })
  @ApiResponse({
    status: 200,
    description: 'Store updated successfully',
    type: GetStoreDto,
  })
  @Patch(':id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    return this.storeService.update(userId, id, updateStoreDto);
  }

  @ApiParam({
    name: 'id',
    description: 'Store unique identifier',
    example: 'c132ab4e-14a0-45be-9806-d661e09063d0',
  })
  @CustomApiNotFoundResponse('Store not found')
  @ApiResponse({
    status: 200,
    description: 'Store deleted successfully',
  })
  @Delete(':id')
  remove(@CurrentUser('id') user_id: string, @Param('id') id: string) {
    return this.storeService.remove(user_id, id);
  }
}

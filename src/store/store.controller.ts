import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Store } from 'src/entities/store.entity';
import {
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  createStoreResponse,
  getAllStoresResponse,
  getStoreByIdResponse,
} from './response/store.response';

@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Auth()
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @ApiBody({ type: CreateStoreDto })
  @ApiConflictResponse({ description: 'Store with this title already exists' })
  @ApiOkResponse(createStoreResponse)
  create(
    @CurrentUser('id') user_id: string,
    @Body() createStoreDto: CreateStoreDto,
  ): Promise<Store> {
    return this.storeService.create(user_id, createStoreDto);
  }

  @Get()
  @ApiOkResponse(getAllStoresResponse)
  findAll(): Promise<Store[]> {
    return this.storeService.findAll();
  }

  @Get(':id')
  @ApiNotFoundResponse({ description: 'Store not found' })
  @ApiOkResponse(getStoreByIdResponse)
  findOne(
    @CurrentUser('id') user_id: string,
    @Param('id') store_id: string,
  ): Promise<Store> {
    return this.storeService.findById(store_id, user_id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateStoreDto })
  @ApiNotFoundResponse({ description: 'Store not found' })
  @ApiConflictResponse({ description: 'Store with this title already exists' })
  @ApiOkResponse(createStoreResponse)
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ): Promise<Store> {
    return this.storeService.update(userId, id, updateStoreDto);
  }

  @Delete(':id')
  @ApiNotFoundResponse({ description: 'Store not found' })
  @ApiOkResponse(createStoreResponse)
  remove(
    @CurrentUser('id') user_id: string,
    @Param('id') id: string,
  ): Promise<Store> {
    return this.storeService.remove(user_id, id);
  }
}

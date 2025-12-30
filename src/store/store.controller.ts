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
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CustomApiUnauthorizedResponse } from 'src/common/decorators/api-responses.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Auth()
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@CustomApiUnauthorizedResponse()
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @ApiBody({ type: CreateStoreDto })
  @Post()
  create(
    @CurrentUser('id') user_id: string,
    @Body() createStoreDto: CreateStoreDto,
  ) {
    return this.storeService.create(user_id, createStoreDto);
  }

  @Get()
  findAll() {
    return this.storeService.findAll();
  }

  @Get(':id')
  findOne(@CurrentUser('id') user_id: string, @Param('id') store_id: string) {
    return this.storeService.findById(store_id, user_id);
  }

  @Patch(':id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    return this.storeService.update(userId, id, updateStoreDto);
  }

  @Delete(':id')
  remove(@CurrentUser('id') user_id: string, @Param('id') id: string) {
    return this.storeService.remove(user_id, id);
  }
}

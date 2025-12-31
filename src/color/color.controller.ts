import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ColorService } from './color.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { Color } from 'src/entities/color.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Auth()
@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Post(':storeId')
  create(
    @Body() createColorDto: CreateColorDto,
    @Param('storeId') storeId: string,
  ): Promise<Color> {
    return this.colorService.create(storeId, createColorDto);
  }

  @Get()
  findAll(): Promise<Color[]> {
    return this.colorService.findAll();
  }

  @Get(':colorId')
  findById(@Param('colorId') colorId: string): Promise<Color> {
    return this.colorService.findById(colorId);
  }

  @Get('store/:storeId')
  findByStoreId(@Param('storeId') storeId: string): Promise<Color[]> {
    return this.colorService.findByStoreId(storeId);
  }

  @Patch(':colorId')
  update(
    @Param('colorId') colorId: string,
    @Body() updateColorDto: UpdateColorDto,
  ): Promise<Color> {
    return this.colorService.update(colorId, updateColorDto);
  }

  @Delete(':colorId')
  remove(@Param('colorId') colorId: string) {
    return this.colorService.remove(colorId);
  }
}

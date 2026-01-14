import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ColorService } from './color.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { Color } from 'src/entities/color.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import {
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { colorsResponse, createColorResponse } from './response/color.response';
import { QueryColorDto } from './dto/query-color.dto';
import { IColorResponse } from './interfaces/IColorResponse';

@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Auth()
@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Post(':storeId')
  @ApiConflictResponse({
    description: 'Color with this name already exists in the store',
  })
  @ApiOkResponse(createColorResponse)
  create(
    @Body() createColorDto: CreateColorDto,
    @Param('storeId') storeId: string,
  ): Promise<Color> {
    return this.colorService.create(storeId, createColorDto);
  }

  @Get()
  @ApiOkResponse(colorsResponse)
  findAll(): Promise<Color[]> {
    return this.colorService.findAll();
  }

  @Get(':colorId')
  @ApiNotFoundResponse({ description: 'Color not found' })
  @ApiOkResponse(createColorResponse)
  findById(@Param('colorId') colorId: string): Promise<Color> {
    return this.colorService.findById(colorId);
  }

  @Get('store/:storeId')
  @ApiNotFoundResponse({ description: 'Color not found' })
  @ApiOkResponse(colorsResponse)
  findByStoreId(
    @Param('storeId') storeId: string,
    @Query() query: QueryColorDto,
  ): Promise<IColorResponse> {
    return this.colorService.findByStoreId(storeId, query);
  }

  @Patch(':colorId')
  @ApiBody({ type: UpdateColorDto })
  @ApiNotFoundResponse({ description: 'Color not found' })
  @ApiOkResponse(createColorResponse)
  update(
    @Param('colorId') colorId: string,
    @Body() updateColorDto: UpdateColorDto,
  ): Promise<Color> {
    return this.colorService.update(colorId, updateColorDto);
  }

  @Delete(':colorId')
  @ApiNotFoundResponse({ description: 'Color not found' })
  @ApiOkResponse({ description: 'Color deleted successfully' })
  remove(@Param('colorId') colorId: string) {
    return this.colorService.remove(colorId);
  }
}

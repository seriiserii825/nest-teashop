import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from 'src/entities/category.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import {
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  categoriesResponse,
  createCategoryResponse,
} from './response/category.response';

@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Auth()
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('store/:storeId')
  @ApiBody({ type: CreateCategoryDto })
  @ApiConflictResponse({ description: 'Category already exists' })
  @ApiOkResponse(createCategoryResponse)
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Param('storeId') storeId: string,
  ): Promise<Category> {
    return this.categoryService.create(storeId, createCategoryDto);
  }

  @Get()
  @ApiOkResponse(categoriesResponse)
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOkResponse(createCategoryResponse)
  @ApiNotFoundResponse({ description: 'Category not found' })
  findOne(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Get('store/:storeId')
  @ApiOkResponse(categoriesResponse)
  findByStoreId(@Param('storeId') storeId: string): Promise<Category[]> {
    return this.categoryService.findByStoreId(storeId);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateCategoryDto })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiOkResponse(createCategoryResponse)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiOkResponse(createCategoryResponse)
  remove(@Param('id') id: string): Promise<Category> {
    return this.categoryService.remove(id);
  }
}

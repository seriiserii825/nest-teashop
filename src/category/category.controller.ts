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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from 'src/entities/category.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Auth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post(':storeId')
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Param('storeId') storeId: string,
  ): Promise<Category> {
    return this.categoryService.create(storeId, createCategoryDto);
  }

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Get('store/:storeId')
  findByStoreId(@Param('storeId') storeId: string): Promise<Category[]> {
    return this.categoryService.findByStoreId(storeId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Category> {
    return this.categoryService.remove(id);
  }
}

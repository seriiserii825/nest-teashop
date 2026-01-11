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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Auth()
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('store/:storeId')
  create(
    @Body() createProductDto: CreateProductDto,
    @Param('storeId') storeId: string,
  ) {
    return this.productService.create(storeId, createProductDto);
  }

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
  ) {
    return this.productService.findAll(page, limit, search);
  }

  @Get('store/:storeId')
  findAllByStoreID(@Param('storeId') storeId: string) {
    return this.productService.findAllByStoreID(storeId);
  }

  @Get('search/:searchTerm')
  findBySearchTerm(@Param('searchTerm') searchTerm: string) {
    return this.productService.findBySearchTerm(searchTerm);
  }

  @Get('category/:categoryId')
  findAllByCategoryID(@Param('categoryId') categoryId: string) {
    return this.productService.findAllByCategoryID(categoryId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}

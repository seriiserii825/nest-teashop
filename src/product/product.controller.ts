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
import { QueryProductDto } from './dto/query-product.dto';
import {
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  createProductResponse,
  getAllProductsResponse,
  getProductByIdResponse,
  getProductsByCategoryIdResponse,
} from './response/product.response';

@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Auth()
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('store/:storeId')
  @ApiBody({ type: CreateProductDto })
  @ApiConflictResponse({
    description: 'Product with this title already exists in the store',
  })
  @ApiOkResponse(createProductResponse)
  create(
    @Body() createProductDto: CreateProductDto,
    @Param('storeId') storeId: string,
  ) {
    return this.productService.create(storeId, createProductDto);
  }

  @Get()
  @ApiOkResponse(getAllProductsResponse)
  findAll(@Query() query: QueryProductDto) {
    return this.productService.findAll(query);
  }

  @Get('store/:storeId')
  @ApiOkResponse(getAllProductsResponse)
  @ApiBody({ type: QueryProductDto })
  findAllByStoreID(
    @Param('storeId') storeId: string,
    @Query() query: QueryProductDto,
  ) {
    return this.productService.findAllByStoreID(storeId, query);
  }

  @Get('category/:categoryId')
  @ApiOkResponse(getProductsByCategoryIdResponse)
  findAllByCategoryID(@Param('categoryId') categoryId: string) {
    return this.productService.findAllByCategoryID(categoryId);
  }

  @Get(':id')
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiOkResponse(getProductByIdResponse)
  findById(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Patch(':id')
  @ApiBody({ type: CreateProductDto })
  @ApiOkResponse(createProductResponse)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiNotFoundResponse({ description: 'Product not found' })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}

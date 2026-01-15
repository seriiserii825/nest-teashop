import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { QueryProductDto } from './dto/query-product.dto';
import {
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
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
import { FilesInterceptor } from '@nestjs/platform-express';
import { createProductSchema } from './schema/create-product.schema';

@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Auth()
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('store/:storeId')
  @ApiBody(createProductSchema)
  @ApiConflictResponse({
    description: 'Product with this title already exists in the store',
  })
  @ApiOkResponse(createProductResponse)
  @UseInterceptors(FilesInterceptor('images', 10)) // максимум 10 файлов
  @ApiConsumes('multipart/form-data')
  create(
    @Body() createProductDto: CreateProductDto,
    @Param('storeId') storeId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productService.create(storeId, createProductDto, files);
  }

  @Patch(':id')
  @ApiBody(createProductSchema)
  @UseInterceptors(FilesInterceptor('images', 10)) // максимум 10 файлов
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse(createProductResponse)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productService.update(id, updateProductDto, files);
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

  @Delete(':id')
  @ApiNotFoundResponse({ description: 'Product not found' })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}

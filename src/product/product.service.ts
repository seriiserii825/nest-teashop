import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async create(storeId: string, createProductDto: CreateProductDto) {
    await this.checkDuplicateTitleInStore(storeId, createProductDto.title);

    const newProduct = this.productRepository.create({
      ...createProductDto,
      storeId,
    });
    return this.productRepository.save(newProduct);
  }

  findAll() {
    return this.productRepository.find({
      order: { updatedAt: 'DESC' },
    });
  }

  findAllByStoreID(storeId: string) {
    return this.productRepository.find({
      where: { storeId },
      order: { updatedAt: 'DESC' },
    });
  }

  async findAllByCategoryID(categoryId: string) {
    const products = await this.productRepository.find({
      where: { categoryId },
      order: { updatedAt: 'DESC' },
    });

    return products;
  }

  async findById(id: string) {
    const product = await this.productRepository.findOne({
      where: { id: id },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found.`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findById(id);
    if (
      updateProductDto.title &&
      updateProductDto.title !== product.title &&
      product.storeId
    ) {
      await this.checkDuplicateTitleInStore(
        product.storeId,
        updateProductDto.title,
      );
    }
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: string) {
    await this.findById(id);
    return this.productRepository.delete(id);
  }

  async checkDuplicateTitleInStore(storeId: string, title: string) {
    const count = await this.productRepository.count({
      where: { storeId, title },
    });
    if (count > 0) {
      throw new BadGatewayException(
        `Product with title '${title}' already exists in this store.`,
      );
    }
  }
}

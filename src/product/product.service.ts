import { BadGatewayException, Injectable } from '@nestjs/common';
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

  findById(id: string) {
    return this.productRepository.findOne({
      where: { id: id },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
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

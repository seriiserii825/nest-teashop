import { FindOptionsOrder, ILike } from 'typeorm';
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
import { QueryProductDto } from './dto/query-product.dto';

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

  async findAll(query: QueryProductDto) {
    const { page = 1, limit = 10, search, sortKey, sortOrder } = query;
    // симуляция задержки
    await new Promise((resolve) => setTimeout(resolve, 600));

    const where = search ? { title: ILike(`%${search}%`) } : {};

    const order = this.buildOrderClause(sortKey, sortOrder);

    const [products, total] = await this.productRepository.findAndCount({
      where,
      order,
      skip: (page - 1) * limit,
      take: limit,
      relations: ['category', 'color'],
    });

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findAllByStoreID(storeId: string) {
    return this.productRepository.find({
      where: { storeId },
      order: { updatedAt: 'DESC' },
    });
  }

  findBySearchTerm(searchTerm: string): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.title ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .orderBy('product.updatedAt', 'DESC')
      .getMany();
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

  private buildOrderClause(
    sortKey?: string,
    sortOrder: 'asc' | 'desc' = 'desc',
  ): FindOptionsOrder<Product> {
    // Маппинг ключей фронтенда на поля базы данных
    const sortMapping: Record<string, string> = {
      title: 'title',
      price: 'price',
      color: 'color.title', // Сортировка по связанной таблице
      category: 'category.title', // Сортировка по связанной таблице
    };

    // Если передан валидный ключ сортировки
    if (sortKey && sortMapping[sortKey]) {
      const dbField = sortMapping[sortKey];

      // Если это связанная таблица (содержит точку)
      if (dbField.includes('.')) {
        const [relation, field] = dbField.split('.');
        return {
          [relation]: { [field]: sortOrder },
          updatedAt: 'DESC', // Дополнительная сортировка
        } as FindOptionsOrder<Product>;
      }

      // Обычное поле
      return {
        [dbField]: sortOrder,
        updatedAt: 'DESC',
      } as FindOptionsOrder<Product>;
    }

    // Сортировка по умолчанию
    return { updatedAt: 'DESC' } as FindOptionsOrder<Product>;
  }
}

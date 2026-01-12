import {
  ConflictException,
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

  // src/products/products.service.ts
  async findAll(query: QueryProductDto) {
    const { page = 1, limit = 10, search, sortKey, sortOrder = 'desc' } = query;
    // Симуляция задержки
    await new Promise((resolve) => setTimeout(resolve, 600));

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.color', 'color');

    // Поиск
    if (search) {
      queryBuilder.where('product.title ILIKE :search', {
        search: `%${search}%`,
      });
    }

    // Сортировка
    const sortMapping: Record<string, string> = {
      title: 'product.title',
      price: 'product.price',
      color: 'color.name', // 👈 Правильный путь для связанной таблицы
      category: 'category.title', // 👈 Правильный путь для связанной таблицы
    };

    if (sortKey && sortMapping[sortKey]) {
      queryBuilder.orderBy(
        sortMapping[sortKey],
        sortOrder.toUpperCase() as 'ASC' | 'DESC',
      );
    }

    // Дополнительная сортировка по дате
    queryBuilder.addOrderBy('product.updatedAt', 'DESC');

    // Пагинация
    const [products, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

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

  async findAllByStoreID(storeId: string, query: QueryProductDto) {
    const { page = 1, limit = 10, search, sortKey, sortOrder = 'desc' } = query;
    // Симуляция задержки
    await new Promise((resolve) => setTimeout(resolve, 600));

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.color', 'color');

    // Поиск
    if (search) {
      queryBuilder.where('product.title ILIKE :search', {
        search: `%${search}%`,
      });
    }

    // Сортировка
    const sortMapping: Record<string, string> = {
      title: 'product.title',
      price: 'product.price',
      color: 'color.name', // 👈 Правильный путь для связанной таблицы
      category: 'category.title', // 👈 Правильный путь для связанной таблицы
    };

    if (sortKey && sortMapping[sortKey]) {
      queryBuilder.orderBy(
        sortMapping[sortKey],
        sortOrder.toUpperCase() as 'ASC' | 'DESC',
      );
    }

    // Дополнительная сортировка по дате
    queryBuilder.addOrderBy('product.updatedAt', 'DESC');

    // Пагинация
    const [products, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .where('product.storeId = :storeId', { storeId })
      .getManyAndCount();

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
      throw new ConflictException(
        `Product with title '${title}' already exists in this store.`,
      );
    }
  }
}

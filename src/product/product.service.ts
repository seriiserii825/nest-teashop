import { unlink } from 'fs/promises';
import { join } from 'path';
import { path as rootPath } from 'app-root-path';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, QueryRunner } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { QueryProductDto } from './dto/query-product.dto';
import { FileService } from 'src/file/file.service';
import IFileResponse from '../file/interfaces/IFileResponse';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private readonly fileService: FileService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    storeId: string,
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
  ) {
    await this.checkDuplicateTitleInStore(storeId, createProductDto.title);

    return this.executeInTransaction(async (queryRunner) => {
      // Создаем и сохраняем продукт без изображений
      const newProduct = this.productRepository.create({
        ...createProductDto,
        storeId,
        images: [],
      });
      const savedProduct = await queryRunner.manager.save(newProduct);

      // Загружаем изображения
      const uploadedImages = await this.uploadProductImages(
        files,
        savedProduct.id,
      );

      // Обновляем продукт с изображениями
      savedProduct.images = uploadedImages.map((img) => img.url);
      return queryRunner.manager.save(savedProduct);
    });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    files?: Express.Multer.File[],
  ) {
    const product = await this.findById(id);

    // Проверка на дубликат названия
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

    return this.executeInTransaction(async (queryRunner) => {
      // Обновляем основные поля
      this.updateProductFields(product, updateProductDto);

      // Обрабатываем изображения
      const { imagesToKeep, imagesToDelete } = this.processImageUpdates(
        product.images,
        updateProductDto.oldImages,
      );

      // Загружаем новые изображения
      const newUploadedImages = await this.uploadProductImages(
        files,
        product.id,
      );

      // Обновляем массив изображений
      product.images = [
        ...imagesToKeep,
        ...newUploadedImages.map((img) => img.url),
      ];

      // Сохраняем продукт
      const updatedProduct = await queryRunner.manager.save(product);

      // Удаляем старые файлы после успешного сохранения
      if (imagesToDelete.length > 0) {
        await this.deleteImageFiles(imagesToDelete);
      }

      return updatedProduct;
    });
  }

  async remove(id: string) {
    const product = await this.findById(id);

    // Удаляем все изображения продукта
    if (product.images.length > 0) {
      await this.deleteImageFiles(product.images);
    }

    return this.productRepository.delete(id);
  }

  // ==================== ПРИВАТНЫЕ ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ====================

  /**
   * Выполняет операцию в транзакции с автоматической обработкой ошибок
   */
  private async executeInTransaction<T>(
    operation: (queryRunner: QueryRunner) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await operation(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof BadRequestException) {
        throw error;
      }

      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new BadRequestException(`Operation failed: ${errorMessage}`);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Загружает изображения продукта
   */
  private async uploadProductImages(
    files: Express.Multer.File[] | undefined,
    productId: string,
  ): Promise<IFileResponse[]> {
    if (!files || files.length === 0) {
      return [];
    }

    try {
      return await this.fileService.uploadFiles(files, `products/${productId}`);
    } catch (fileError) {
      const errorMessage =
        fileError instanceof Error ? fileError.message : 'Unknown error';
      throw new BadRequestException(`File upload failed: ${errorMessage}`);
    }
  }

  /**
   * Обновляет поля продукта из DTO
   */
  private updateProductFields(
    product: Product,
    updateDto: UpdateProductDto,
  ): void {
    if (updateDto.title !== undefined) product.title = updateDto.title;
    if (updateDto.description !== undefined)
      product.description = updateDto.description;
    if (updateDto.price !== undefined) product.price = updateDto.price;
    if (updateDto.categoryId !== undefined)
      product.categoryId = updateDto.categoryId;
    if (updateDto.colorId !== undefined) product.colorId = updateDto.colorId;
  }

  /**
   * Определяет какие изображения оставить, а какие удалить
   */
  private processImageUpdates(
    currentImages: string[],
    oldImages?: string[],
  ): { imagesToKeep: string[]; imagesToDelete: string[] } {
    const imagesToKeep = oldImages || [];
    const imagesToDelete = currentImages.filter(
      (img) => !imagesToKeep.includes(img),
    );

    return { imagesToKeep, imagesToDelete };
  }

  /**
   * Удаляет файлы изображений с диска
   */
  private async deleteImageFiles(imageUrls: string[]): Promise<void> {
    const deletePromises = imageUrls.map(async (url) => {
      try {
        const filePath = join(rootPath, url);
        await unlink(filePath);
        console.log(`Deleted image: ${filePath}`);
      } catch (error) {
        console.error(`Failed to delete image ${url}:`, error);
      }
    });

    await Promise.allSettled(deletePromises);
  }

  // ==================== ПУБЛИЧНЫЕ МЕТОДЫ ПОИСКА ====================

  async findAll(query: QueryProductDto) {
    const { page = 1, limit = 10, search, sortKey, sortOrder = 'desc' } = query;
    await new Promise((resolve) => setTimeout(resolve, 600));

    const queryBuilder = this.buildProductQuery(search, sortKey, sortOrder);

    const [products, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return this.buildPaginatedResponse(products, total, page, limit);
  }

  async findAllByStoreID(storeId: string, query: QueryProductDto) {
    const { page = 1, limit = 10, search, sortKey, sortOrder = 'desc' } = query;
    await new Promise((resolve) => setTimeout(resolve, 600));

    const queryBuilder = this.buildProductQuery(search, sortKey, sortOrder);
    queryBuilder.andWhere('product.storeId = :storeId', { storeId });

    const [products, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return this.buildPaginatedResponse(products, total, page, limit);
  }

  async findAllByCategoryID(categoryId: string) {
    return this.productRepository.find({
      where: { categoryId },
      order: { updatedAt: 'DESC' },
    });
  }

  async findById(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found.`);
    }

    return product;
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

  // ==================== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ЗАПРОСОВ ====================

  private buildProductQuery(
    search?: string,
    sortKey?: string,
    sortOrder: string = 'desc',
  ) {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.color', 'color');

    if (search) {
      queryBuilder.where('product.title ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const sortMapping: Record<string, string> = {
      title: 'product.title',
      price: 'product.price',
      color: 'color.name',
      category: 'category.title',
    };

    if (sortKey && sortMapping[sortKey]) {
      queryBuilder.orderBy(
        sortMapping[sortKey],
        sortOrder.toUpperCase() as 'ASC' | 'DESC',
      );
    }

    queryBuilder.addOrderBy('product.updatedAt', 'DESC');

    return queryBuilder;
  }

  private buildPaginatedResponse(
    data: Product[],
    total: number,
    page: number,
    limit: number,
  ) {
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

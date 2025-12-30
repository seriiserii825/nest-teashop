import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(
    storeId: string,
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    await this.checkDuplicateTitleInStore(storeId, createCategoryDto.title);
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      storeId,
    });
    return this.categoryRepository.save(category);
  }

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ order: { updatedAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found.`);
    }
    return category;
  }

  findByStoreId(storeId: string): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { storeId },
      order: { updatedAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    await this.findOne(id);
    return this.categoryRepository.save({
      id: id,
      ...updateCategoryDto,
    });
  }

  async remove(id: string): Promise<Category> {
    const category = await this.findOne(id);
    await this.categoryRepository.delete(id);
    return category;
  }

  async checkDuplicateTitleInStore(storeId: string, title: string) {
    const count = await this.categoryRepository.count({
      where: { storeId, title },
    });
    if (count > 0) {
      throw new BadGatewayException(
        `Category with title '${title}' already exists in this store.`,
      );
    }
  }
}

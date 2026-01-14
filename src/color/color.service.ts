import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Color } from 'src/entities/color.entity';
import { QueryProductDto } from 'src/product/dto/query-product.dto';
import { IColorResponse } from './interfaces/IColorResponse';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(Color) private colorRepository: Repository<Color>,
  ) {}

  async create(storeId: string, createColorDto: CreateColorDto) {
    await this.checkDuplicateNameInStore(storeId, createColorDto.name);
    const color = this.colorRepository.create({
      ...createColorDto,
      storeId,
    });
    return this.colorRepository.save(color);
  }

  async findByStoreId(
    storeId: string,
    query: QueryProductDto,
  ): Promise<IColorResponse> {
    const { page = 1, limit = 10, search, sortKey, sortOrder = 'desc' } = query;
    // Симуляция задержки
    await new Promise((resolve) => setTimeout(resolve, 600));

    const queryBuilder = this.colorRepository.createQueryBuilder('color');

    // Поиск
    if (search) {
      queryBuilder.where('color.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    // Сортировка
    const sortMapping: Record<string, string> = {
      name: 'name.title',
    };

    if (sortKey && sortMapping[sortKey]) {
      queryBuilder.orderBy(
        sortMapping[sortKey],
        sortOrder.toUpperCase() as 'ASC' | 'DESC',
      );
    }

    // Дополнительная сортировка по дате
    queryBuilder.addOrderBy('color.updatedAt', 'DESC');

    // Пагинация
    const [colors, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .where('color.storeId = :storeId', { storeId })
      .getManyAndCount();

    return {
      data: colors,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findAll(): Promise<Color[]> {
    return this.colorRepository.find({
      order: { updatedAt: 'DESC' },
    });
  }

  async findById(colorId: string): Promise<Color> {
    const color = await this.colorRepository.findOne({
      where: { id: colorId },
    });
    if (!color) {
      throw new BadGatewayException(`Color with ID '${colorId}' not found.`);
    }
    return color;
  }

  update(colorId: string, updateColorDto: UpdateColorDto) {
    return this.colorRepository.save({
      id: colorId,
      ...updateColorDto,
    });
  }

  async remove(colorId: string) {
    const color = await this.findById(colorId);
    await this.colorRepository.delete(colorId);
    return color;
  }

  async checkDuplicateNameInStore(storeId: string, name: string) {
    const count = await this.colorRepository.count({
      where: { storeId, name },
    });
    if (count > 0) {
      throw new BadGatewayException(
        `Color with name '${name}' already exists in this store.`,
      );
    }
  }
}

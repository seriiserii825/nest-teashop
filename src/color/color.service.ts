import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Color } from 'src/entities/color.entity';

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

  findByStoreId(storeId: string): Promise<Color[]> {
    return this.colorRepository.find({ where: { storeId } });
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
    await this.findById(colorId);
    return this.colorRepository.delete(colorId);
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

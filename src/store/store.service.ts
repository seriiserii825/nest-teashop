import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/entities/store.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store) private storeRepository: Repository<Store>,
  ) {}
  async create(userId: string, createStoreDto: CreateStoreDto): Promise<Store> {
    await this.haveDuplicateTitle(userId, createStoreDto.title);
    const newStore = this.storeRepository.create({
      ...createStoreDto,
      user: { id: userId },
    });
    return this.storeRepository.save(newStore);
  }

  findAll(): Promise<Store[]> {
    return this.storeRepository.find({
      order: { updatedAt: 'DESC' },
    });
  }

  async findById(store_id: string, user_id: string): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id: store_id, user: { id: user_id } },
    });
    if (!store)
      throw new NotFoundException('Store not found, or you are not the owner');
    return store;
  }

  async update(
    userId: string,
    id: string,
    updateStoreDto: UpdateStoreDto,
  ): Promise<Store> {
    await this.haveDuplicateTitle(userId, updateStoreDto.title);

    const store = await this.findById(id, userId);

    Object.assign(store, updateStoreDto);
    return this.storeRepository.save(store);
  }

  async remove(user_id: string, id: string): Promise<Store> {
    const store = await this.findById(id, user_id);
    return this.storeRepository.remove(store);
  }

  async haveDuplicateTitle(userId: string, title: string): Promise<void> {
    const store = await this.storeRepository.findOne({
      where: { user: { id: userId }, title },
    });
    if (store) {
      throw new BadRequestException('Store with this title already exists');
    }
  }
}

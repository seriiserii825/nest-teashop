import { Injectable, NotFoundException } from '@nestjs/common';

import { hash } from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { AuthRegisterDto } from 'src/auth/dto/auth-register.dto';
import { IUserFavorite } from './interfaces/IUserFavorite';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async getAll(): Promise<User[]> {
    const users = await this.userRepository.find({
      relations: ['stores', 'orders', 'favorites'],
      order: { updatedAt: 'DESC' },
    });
    return users;
  }

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['stores', 'orders', 'favorites'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async checkByEmail(email: string): Promise<boolean> {
    return this.userRepository.exists({ where: { email } });
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['stores', 'orders', 'favorites'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(dto: AuthRegisterDto): Promise<User> {
    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: dto.password ? await hash(dto.password) : undefined,
      picture: dto.picture || undefined,
    });
    await this.userRepository.save(user);
    return user;
  }

  async toggleFavorite(
    userId: string,
    productId: string,
  ): Promise<IUserFavorite> {
    const user = await this.getById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Проверяем существование продукта
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // // Проверяем, есть ли продукт в избранном
    const productIndex = user.favorites.findIndex((p) => p.id === productId);

    if (productIndex !== -1) {
      // Убираем из избранного
      user.favorites.splice(productIndex, 1);
    } else {
      // Добавляем в избранное
      user.favorites.push(product);
    }

    // Сохраняем изменения
    await this.userRepository.save(user);

    return {
      message:
        productIndex !== -1 ? 'Removed from favorites' : 'Added to favorites',
      isFavorite: productIndex === -1,
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthDto } from 'src/auth/dto/auth.dto';

import { hash } from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/product.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async getAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async getById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['stores', 'orders', 'favorites'],
    });
    return user;
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['stores', 'orders', 'favorites'],
    });
    return user;
  }

  async create(dto: AuthDto) {
    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: dto.password ? await hash(dto.password) : undefined,
      picture: dto.picture || undefined,
    });
    await this.userRepository.save(user);
    return user;
  }

  async toggleFavoriteProduct(userId: string, productId: string) {
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

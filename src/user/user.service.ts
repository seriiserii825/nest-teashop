import { Injectable } from '@nestjs/common';
import { AuthDto } from 'src/auth/dto/auth.dto';

import { hash } from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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
}

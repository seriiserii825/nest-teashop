import { Controller, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from './decorators/user.decorator';
import { User } from 'src/entities/user.entity';
import { IUserFavorite } from './interfaces/IUserFavorite';

@Auth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get('profile')
  async getProfile(@CurrentUser('id') id: string): Promise<User> {
    const user = await this.userService.getById(id);
    return user;
  }

  @Patch('favorites/:productId')
  toggleFavorite(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ): Promise<IUserFavorite> {
    return this.userService.toggleFavorite(userId, productId);
  }
}

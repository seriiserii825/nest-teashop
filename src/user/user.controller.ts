import { Controller, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from './decorators/user.decorator';
import { User } from 'src/entities/user.entity';
import { IUserFavorite } from './interfaces/IUserFavorite';
import { CustomApiUnauthorizedResponse } from 'src/decorators/api-response.decorator';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  favoriteResponse,
  userResponse,
  usersResponse,
} from 'src/auth/response/register.response';

@CustomApiUnauthorizedResponse()
@Auth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOkResponse(usersResponse)
  async getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get('profile')
  @ApiOkResponse(userResponse)
  async getProfile(@CurrentUser('id') id: string): Promise<User> {
    const user = await this.userService.getById(id);
    return user;
  }

  @Patch('favorites/:productId')
  @ApiNotFoundResponse({ description: 'User or Product not found' })
  @ApiOkResponse(favoriteResponse)
  toggleFavorite(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ): Promise<IUserFavorite> {
    return this.userService.toggleFavorite(userId, productId);
  }
}

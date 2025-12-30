import { Controller, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from './decorators/user.decorator';
import { ApiParam, ApiResponse } from '@nestjs/swagger';
import { UserDataDto } from 'src/auth/dto/auth-user-response.dto';
import { CustomApiNotFoundResponse } from 'src/common/decorators/api-responses.decorator';

@Auth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @CustomApiNotFoundResponse('Users not found')
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: UserDataDto,
  })
  @Get()
  async getAll() {
    return this.userService.getAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Current user profile data',
    type: UserDataDto,
  })
  @Get('profile')
  async getProfile(@CurrentUser('id') id: string) {
    const user = await this.userService.getById(id);
    return user;
  }

  @Patch('favorites/:productId')
  toggleFavorite(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.userService.toggleFavorite(userId, productId);
  }
}

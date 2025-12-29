import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from './decorators/user.decorator';

@Auth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll() {
    return this.userService.getAll();
  }

  @Get('profile')
  async getProfile(@CurrentUser('id') id: string) {
    console.log(id, 'id');
    const user = await this.userService.getById(id);
    console.log('user', user);
    return user;
  }
}

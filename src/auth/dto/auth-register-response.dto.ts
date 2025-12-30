import { ApiProperty } from '@nestjs/swagger';
import { UserDataDto } from './auth-user-response.dto';

export class AuthRegisterResponseDto {
  @ApiProperty({ type: UserDataDto })
  user: UserDataDto;
}

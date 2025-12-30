import { ApiProperty } from '@nestjs/swagger';
import { UserDataDto } from './auth-user-response.dto';

export class LoginResponseDto {
  @ApiProperty({ type: UserDataDto })
  user: UserDataDto;

  @ApiProperty({
    example: 'my-token',
  })
  accessToken: string;
}

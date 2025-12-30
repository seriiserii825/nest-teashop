import { ApiProperty } from '@nestjs/swagger';
import { UserDataDto } from './auth-user-response.dto';

export class LoginResponseDto {
  @ApiProperty({ type: UserDataDto })
  user: UserDataDto;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZTQyMzFjNC05NGQ4LTRkYzAtYTY1YS05MTc3Yjk3ZjRhNjEiLCJpYXQiOjE3NjcwODQ5NzYsImV4cCI6MTc2NzA4NTg3Nn0.PNhZ5reIDdV0f9VMXmt-MMKmkCPDr3L2kHuYfQ_g9i4',
  })
  accessToken: string;
}

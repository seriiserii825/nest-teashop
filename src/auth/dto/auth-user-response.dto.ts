// auth/dto/login-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UserDataDto {
  @ApiProperty({ example: 'de4231c4-94d8-4dc0-a65a-9177b97f4a61' })
  id: string;

  @ApiProperty({ example: '2025-12-29T13:36:53.777Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-12-29T13:36:53.777Z' })
  updatedAt: Date;

  @ApiProperty({ example: 'seriiburduja@gmail.com' })
  email: string;

  @ApiProperty({ example: 'John Doe', nullable: true })
  name: string | null;

  @ApiProperty({ example: '/uploads/no-user-image.png' })
  picture: string;

  @ApiProperty({ example: [], type: 'array' })
  stores: any[];

  @ApiProperty({ example: [], type: 'array' })
  orders: any[];

  @ApiProperty({ example: [], type: 'array' })
  favorites: any[];
}

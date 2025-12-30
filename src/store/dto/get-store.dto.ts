import { ApiProperty } from '@nestjs/swagger';

export class GetStoreDto {
  @ApiProperty({
    description: 'Store unique identifier',
    example: 'c132ab4e-14a0-45be-9806-d661e09063d0',
  })
  id: string;

  @ApiProperty({
    description: 'Store title',
    example: 'My First Store',
  })
  title: string;

  @ApiProperty({
    description: 'Store description',
    example: 'A store selling amazing products',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    description: 'Store creation date',
    example: '2025-12-30T13:43:50.920Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Store last update date',
    example: '2025-12-30T13:43:50.920Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'User ID who owns the store',
    example: '03725763-7d01-466e-8cd6-72580d087af5',
  })
  userId: string;
}

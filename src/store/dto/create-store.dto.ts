import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({
    description: 'Title of the store, is unique per user',
    example: 'My Awesome Store',
  })
  @IsString()
  title: string;
}

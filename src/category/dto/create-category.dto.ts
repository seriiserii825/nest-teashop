import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics', description: 'Title of the category' })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Category for electronic products',
    description: 'Description of the category',
  })
  @IsString()
  description: string;
}

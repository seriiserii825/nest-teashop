import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class UpdateColorDto {
  @ApiProperty({ example: 'Red', description: 'Name of the color' })
  @IsString()
  name: string;

  @ApiProperty({ example: '#FF0000', description: 'Hex code of the color' })
  @IsString()
  @Matches(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, {
    message: 'value must be a valid hex color code',
  })
  value: string;
}

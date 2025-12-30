import { IsString, Matches } from 'class-validator';

export class CreateColorDto {
  @IsString()
  name: string;

  @IsString()
  @Matches(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, {
    message: 'value must be a valid hex color code',
  })
  value: string;
}

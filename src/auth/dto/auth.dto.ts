import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty({ required: false, minLength: 6 })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  picture?: string;
}

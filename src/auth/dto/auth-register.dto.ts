import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthRegisterDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  picture?: string;
}

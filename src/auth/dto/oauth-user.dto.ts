// auth/dto/oauth-user.dto.ts
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class OAuthUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  picture?: string;
}

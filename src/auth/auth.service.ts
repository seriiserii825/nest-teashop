import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/entities/user.entity';
import { exclude } from 'src/utils/exclude-fields';

interface OAuthUser {
  email: string;
  name: string;
  picture: string;
}

interface OAuthRequest {
  user: OAuthUser;
}

interface IJwtPayload {
  sub: string;
}

@Injectable()
export class AuthService {
  EXPIRES_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = 'refreshToken';

  constructor(
    private jwt: JwtService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}
  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }
  async register(dto: AuthDto) {
    const oldUser = await this.userService.getByEmail(dto.email);
    if (oldUser) {
      throw new BadRequestException('User already exists');
    }
    const user = await this.userService.create(dto);
    return exclude(user, 'password');
  }

  async getNewTokens(refreshToken: string): Promise<{
    user: any;
    accessToken: string;
    refreshToken: string;
  }> {
    const tokenIsValid: IJwtPayload = await this.jwt.verifyAsync(refreshToken); // ✅ Изменили на 'sub'

    if (!tokenIsValid) throw new BadRequestException('Invalid refresh token');

    const user = await this.userService.getById(tokenIsValid.sub); // ✅ Используем 'sub'
    if (!user) throw new NotFoundException('User not found');

    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }

  issueTokens(userId: string) {
    const payload = { sub: userId }; // ✅ Используем 'sub'

    const accessToken = this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async validateOAuthLogin(req: unknown) {
    if (!req || typeof req !== 'object' || !('user' in req) || !req.user) {
      throw new BadRequestException('No user from OAuth provider');
    }

    const oauthReq = req as OAuthRequest;
    const user = await this.userService.getByEmail(oauthReq.user.email);
    let new_user: User | null = null;
    if (!user) {
      new_user = await this.userService.create({
        email: oauthReq.user.email,
        name: oauthReq.user.name,
        picture: oauthReq.user.picture,
      });
      const tokens = this.issueTokens(new_user.id);
      return { user: new_user, ...tokens };
    }
    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getByEmail(dto.email);
    console.log('user', user);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expires_in = new Date();
    expires_in.setDate(expires_in.getDate() + this.EXPIRES_DAY_REFRESH_TOKEN);
    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: this.configService.get<string>('SERVER_DOMAIN'),
      expires: expires_in,
      secure: true,
      sameSite: 'lax',
    });
  }

  removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: this.configService.get<string>('SERVER_DOMAIN'),
      expires: new Date(0),
      secure: true,
      sameSite: 'lax',
    });
  }
}

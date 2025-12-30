import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { CustomApiBadRequestResponse } from 'src/common/decorators/api-responses.decorator';
import { AuthRegisterResponseDto } from './dto/auth-register-response.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthLoginDto } from './dto/auth-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: AuthRegisterDto })
  @CustomApiBadRequestResponse('Invalid credentials or user already exists')
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthRegisterResponseDto,
  })
  @Post('register')
  register(@Body() dto: AuthRegisterDto) {
    return this.authService.register(dto);
  }

  @HttpCode(200)
  @ApiBody({ type: AuthLoginDto })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: AuthRegisterResponseDto,
  })
  @Post('login')
  async login(
    @Body() dto: AuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } = await this.authService.login(dto);
    this.authService.addRefreshTokenToResponse(res, refreshToken);
    return response;
  }

  @HttpCode(200)
  @Post('login/access-token')
  async loginAccessToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!req.cookies) throw new Error('No cookies in request');
    const refreshTokenFromCookie = req.cookies[
      this.authService.REFRESH_TOKEN_NAME
    ] as string | undefined;

    if (!refreshTokenFromCookie) {
      throw new Error('No refresh token in cookies');
    }

    const { refreshToken, ...response } = await this.authService.getNewTokens(
      refreshTokenFromCookie,
    );
    this.authService.addRefreshTokenToResponse(res, refreshToken);
    return response;
  }

  @HttpCode(200)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshTokenFromResponse(res);
  }

  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleAuth(@Req() _req: any) {}

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async googleAuthCallback(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } =
      await this.authService.validateOAuthLogin(req);
    this.authService.addRefreshTokenToResponse(res, refreshToken);
    return res.redirect(
      `${process.env.CLIENT_URL}/dashboard?accessToken=${response.accessToken}`,
    );
  }
}

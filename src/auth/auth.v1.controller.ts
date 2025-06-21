import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { RegisterRequestDto } from './dto/register-request.dto';
import { LoginResponseDTO } from './dto/login-response.dto';
import { RegisterResponseDTO } from './dto/register-response.dto';
import { Public } from './decorators/public.decorator';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto } from './dto/login-request.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { GoogleAuthGuard } from './guards/google.guard';

@ApiTags('auth-v1')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly authRefreshTokenService: AuthRefreshTokenService,
  ) {}

  @ApiBody({
    type: LoginRequestDto,
  })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refresh_token: { type: 'string' },
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Request() req): Promise<LoginResponseDTO | BadRequestException> {
    return this.authService.login(req.user);
  }

  @Public()
  @ApiBearerAuth()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh-tokens')
  refreshTokens(@Request() req) {
    if (!req.user) {
      throw new InternalServerErrorException();
    }
    return this.authRefreshTokenService.generateTokenPair(
      (req.user as any).attributes,
      req.headers.authorization?.split(' ')[1],
      (req.user as any).refreshTokenExpiresAt,
    );
  }

  @ApiBody({
    type: RegisterRequestDto,
  })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refresh_token: { type: 'string' },
      },
    },
  })
  @Public()
  @Post('register')
  async register(
    @Body() registerBody: RegisterRequestDto,
  ): Promise<RegisterResponseDTO | BadRequestException> {
    return await this.authService.register(registerBody);
  }

  // google login
  @Get('google')
  @Public()
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}

  @Get('google/callback')
  @Public()
  @UseGuards(GoogleAuthGuard)
  googleLoginCallback(@Request() req) {
    // maybe redirect to the frontend after login and send the token as a query param

    // here we opt out from google tokens and user the internal token mechanism to unify the token generation/parsing
    return this.authService.login(req.user);
  }
}

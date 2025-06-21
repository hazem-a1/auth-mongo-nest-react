import { BadRequestException, Injectable } from '@nestjs/common';
import { AccessToken } from './types/AccessToken';
import { RegisterRequestDto } from './dto/register-request.dto';
import { UserService } from 'src/user/user.service';
import { UserDocument } from 'src/user/schema/user.schema';
import { CryptoService } from 'src/crypto/crypto.service';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { AuthProvider } from 'src/user/enum/userProvider.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private cryptoService: CryptoService,
    private readonly authRefreshTokenService: AuthRefreshTokenService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Wrong Credentials');
    }
    const isMatch: boolean = await this.cryptoService.compareHash(
      password,
      user.password || '',
    );
    if (isMatch) {
      return user;
    }
    throw new BadRequestException('Wrong Credentials');
  }

  async login(user: UserDocument): Promise<AccessToken> {
    return this.authRefreshTokenService.generateTokenPair(user);
  }

  async register(user: RegisterRequestDto): Promise<AccessToken> {
    const existingUser = await this.usersService.findByEmail(user.email);

    if (existingUser) {
      throw new BadRequestException('Wrong Credentials');
    }
    const hashedPassword = await this.cryptoService.generateHash(user.password);
    const newUser = {
      ...user,
      password: hashedPassword,
      provider: AuthProvider.LOCAL,
    };
    const result = await this.usersService.create(newUser);
    return this.login(result);
  }
}

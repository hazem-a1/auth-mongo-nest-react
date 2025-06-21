import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guards/jwt.guard';
import { CryptoModule } from './crypto/crypto.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    UserModule,
    AuthModule,
    CryptoModule,
    ...(process.env.CURRENT_ENV === 'LOCALHOST'
      ? []
      : [
          ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../frontend/dist'),
            serveStaticOptions: {
              fallthrough: false,
            },
            exclude: ['/api/**/*'],
          }),
        ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}

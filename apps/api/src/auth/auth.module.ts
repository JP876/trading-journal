import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('appConfig.jwtSecret'),
        signOptions: {
          expiresIn: `${configService.get<number>('appConfig.accessExpirationTime') || 600}s`,
        },
      }),
    }),
  ],
})
export class AuthModule {}

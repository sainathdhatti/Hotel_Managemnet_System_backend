import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SuperAdminAuthService } from './superadminauth.service';
import { SuperAdminAuthController } from './superadminauth.controller';
import { SuperAdminModule } from '../super-admin/super-admin.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule, // Import ConfigModule to access ConfigService
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Use ConfigService to get the secret
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    SuperAdminModule,
    JwtModule, // Import SuperAdminModule to access SuperAdminService
  ],
  providers: [SuperAdminAuthService],
  controllers: [SuperAdminAuthController],
  exports: [SuperAdminAuthService],
})
export class SuperAdminAuthModule {}

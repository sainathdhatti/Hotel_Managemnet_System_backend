import { Module } from '@nestjs/common';
import { AdminAuthController } from './admin_auth.controller';
import { AdminAuthService } from './admin_auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    AdminModule,
    JwtModule.register({
      global:true,
      secret:process.env.HOTEL_MANAGEMENT_SECRET,
      signOptions:{expiresIn:'1d'}
    }),

  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService]
})
export class AdminAuthModule {}

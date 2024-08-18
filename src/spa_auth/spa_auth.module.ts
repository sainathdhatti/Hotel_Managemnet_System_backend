import { Module } from '@nestjs/common';
import { SpaAuthController } from './spa_auth.controller';
import { SpaAuthService } from './spa_auth.service';
import { StaffMembersModule } from 'src/staff_members/staff_members.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [StaffMembersModule,
    StaffMembersModule,
    JwtModule.register({
      global:true,
      secret:process.env.HOTEL_MANAGEMENT_SECRET,
      signOptions:{expiresIn:'1d'}
    }),

  ],
  controllers: [SpaAuthController],
  providers: [SpaAuthService]
})
export class SpaAuthModule {}

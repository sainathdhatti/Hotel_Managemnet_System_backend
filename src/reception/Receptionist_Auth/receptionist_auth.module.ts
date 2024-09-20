import { Module } from '@nestjs/common';
import { StaffMembersModule } from 'src/staff_members/staff_members.module';
import { JwtModule } from '@nestjs/jwt';
import { Receptionist } from '../receptionist.Entity';
import { ReceptionistAuthController } from './receptionist_auth.controller';
import { ReceptionistAuthService } from './receptionist_auth.service';

@Module({
  imports: [StaffMembersModule,
    StaffMembersModule,
    JwtModule.register({
      global:true,
      secret:process.env.HOTEL_MANAGEMENT_SECRET,
      signOptions:{expiresIn:'1d'}
    }),

  ],
  controllers: [ReceptionistAuthController],
  providers: [ReceptionistAuthService]
})
export class ReceptionistAuthModule {}

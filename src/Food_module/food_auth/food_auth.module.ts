import { Module } from '@nestjs/common';
import { FoodAuthController } from './food_auth.controller';
import { FoodAuthService } from './food_auth.service';
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
  controllers: [FoodAuthController],
  providers: [FoodAuthService]
})
export class FoodAuthModule {}

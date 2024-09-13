import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinalBillingController } from './final_billing.controller';
import { FinalBillingService } from './final_billing.service';
import { UserModule } from 'src/user/user.module';
import { BookingsModule } from 'src/bookings/bookings.module';
import { FinalBilling } from './final_billing.Entity';

@Module({
  imports: [TypeOrmModule.forFeature([FinalBilling]),UserModule,BookingsModule],
  controllers: [FinalBillingController],
  providers: [FinalBillingService],
  exports: [FinalBillingService],
})
export class FinalBillingModule {}

import { Module } from '@nestjs/common';
import { ReceptionistController } from './receptionist.controller';
import { ReceptionistService } from './receptionist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinalBillingModule } from 'src/final_billing/final_billing.module';
import { Receptionist } from './receptionist.Entity';
import { BookingsModule } from 'src/bookings/bookings.module';

@Module({
  imports:[TypeOrmModule.forFeature([Receptionist]),FinalBillingModule,BookingsModule],
  controllers: [ReceptionistController],
  providers: [ReceptionistService]
})
export class ReceptionistModule {}

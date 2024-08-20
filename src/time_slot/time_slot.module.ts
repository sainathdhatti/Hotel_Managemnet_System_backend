import { Module } from '@nestjs/common';
import { TimeSlotController } from './time_slot.controller';
import { TimeSlotService } from './time_slot.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSlot } from './time_slot.Entity';

@Module({
  imports:[TypeOrmModule.forFeature([TimeSlot])],
  controllers: [TimeSlotController],
  providers: [TimeSlotService],
  exports:[TimeSlotService]
})
export class TimeSlotModule {}

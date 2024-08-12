import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeSlot } from './time_slot.Entity';
import { Repository } from 'typeorm';
import { CreateTimeSlotDto } from './dtos/createtime_slot.dto';
import { UpdateTimeSlotDto } from './dtos/updatetime_slot.dto';

@Injectable()
export class TimeSlotService {
    constructor(
        @InjectRepository(TimeSlot)private readonly timeSlotRepository: Repository<TimeSlot>,) {}
    
      async findTimeSlot(): Promise<TimeSlot[]> {
        return this.timeSlotRepository.find();
      }
    
      async findTimeSlotById(id: number){
        const timeSlot = await this.timeSlotRepository.findOne({ where: { id } });
        if (!timeSlot) {
          throw new NotFoundException(`TimeSlot  not found`);
        }
        return timeSlot;
      }

      async createTimeSlot(createTimeSlot: CreateTimeSlotDto) {
        const timeSlot = this.timeSlotRepository.create(createTimeSlot);
        return this.timeSlotRepository.save(timeSlot);
      }
    
      async updateTimeSlot(id: number, updateTimeSlot: UpdateTimeSlotDto) {
        const timeSlot = await this.findTimeSlotById(id);
        Object.assign(timeSlot, updateTimeSlot);
        return this.timeSlotRepository.save(timeSlot);
      }

      async deleteTimeSlot(id: number) {
        const result = await this.timeSlotRepository.delete(id);
        if (result.affected === 0) {
          throw new NotFoundException(`TimeSlot not found`);
        }
      }
}

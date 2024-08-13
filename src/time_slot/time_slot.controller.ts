import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TimeSlotService } from './time_slot.service';
import { CreateTimeSlotDto } from './dtos/createtime_slot.dto';
import { UpdateTimeSlotDto } from './dtos/updatetime_slot.dto';
import { AdminAuthGuard } from 'src/admin_auth/admin_authGuard';

@Controller('time-slot')
@UseGuards(AdminAuthGuard)
export class TimeSlotController {
    constructor(private readonly timeSlotService: TimeSlotService) {}

  @Get()
  async findTimeSlot() {
    return this.timeSlotService.findTimeSlot();
  }

  @Get(':id')
  async findTimeSlotById(@Param('id',ParseIntPipe) id: number) {
    return this.timeSlotService.findTimeSlotById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe)
  async createTimeSlot(@Body() createTimeSlot: CreateTimeSlotDto) {
    return this.timeSlotService.createTimeSlot(createTimeSlot);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe)
  async updateTimeSlot(@Param('id',ParseIntPipe) id: number, @Body() updateTimeSlot: UpdateTimeSlotDto) {
    return this.timeSlotService.updateTimeSlot(id, updateTimeSlot);
  }

  @Delete(':id')
  async deleteTimeSlot(@Param('id',ParseIntPipe) id: number) {
    return this.timeSlotService.deleteTimeSlot(id);
  }
}

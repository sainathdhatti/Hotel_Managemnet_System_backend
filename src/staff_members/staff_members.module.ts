import { Module } from '@nestjs/common';
import { StaffMembersController } from './staff_members.controller';
import { StaffMembersService } from './staff_members.service';
import { Staff_Members } from './staff_members.Entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffCategoryModule } from 'src/staff_category/staff_category.module';

@Module({
  imports:[TypeOrmModule.forFeature([Staff_Members]),StaffCategoryModule],
  controllers: [StaffMembersController],
  providers: [StaffMembersService],
  exports:[StaffMembersService]
})
export class StaffMembersModule {}

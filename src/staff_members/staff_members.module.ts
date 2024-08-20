import { Module } from '@nestjs/common';
import { StaffMembersController } from './staff_members.controller';
import { StaffMembersService } from './staff_members.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffMembers } from './staff_membersEntity';
import { StaffCategoryModule } from 'src/staff_category/staff_category.module';
import { StaffCategory } from 'src/staff_category/staff_categoryEntity';

@Module({
  imports:[TypeOrmModule.forFeature([StaffMembers]),StaffCategoryModule],
  controllers: [StaffMembersController],
  providers: [StaffMembersService],
  exports:[StaffMembersService]
})
export class StaffMembersModule {}

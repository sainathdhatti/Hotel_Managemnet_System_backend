import { Module } from '@nestjs/common';
import { StaffCategoryController } from './staff_category.controller';
import { StaffCategoryService } from './staff_category.service';
import { StaffCategory } from './staff_category.Entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([StaffCategory])],
  controllers: [StaffCategoryController],
  providers: [StaffCategoryService],
  exports:[TypeOrmModule.forFeature([StaffCategory]),StaffCategoryService]
})
export class StaffCategoryModule {}

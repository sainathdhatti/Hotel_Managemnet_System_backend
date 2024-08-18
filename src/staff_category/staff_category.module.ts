import { Module } from '@nestjs/common';
import { StaffCategoryController } from './staff_category.controller';
import { StaffCategoryService } from './staff_category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffCategory } from './staff_categoryEntity';

@Module({
  imports:[TypeOrmModule.forFeature([StaffCategory])],
  controllers: [StaffCategoryController],
  providers: [StaffCategoryService],
  exports:[StaffCategoryService]
})
export class StaffCategoryModule {}

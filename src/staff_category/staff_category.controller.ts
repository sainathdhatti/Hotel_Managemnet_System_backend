import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { StaffCategoryService } from './staff_category.service';
import { CreatestaffcategoryDto } from './staff_category.dto';
import { AdminAuthGuard } from 'src/admin_auth/admin_authGuard';

@Controller('staff-category')
@UseGuards(AdminAuthGuard)
export class StaffCategoryController {

    constructor(private staffcategoryService:StaffCategoryService){}
    
    @Get()
    async getAllStaffCategory(){
        return await this.staffcategoryService.getAllStaffCategory();
    }

    @Get(':id')
    async getStaffCategoryById(@Param('id',ParseIntPipe) id:number){
          const staffcategory=await this.staffcategoryService.getStaffCategoryById(id)
          if(!staffcategory){
             return new NotFoundException('Category not found.')
          }  
          else{
            return staffcategory;
          }
    }

    @Post()
    @UsePipes(new ValidationPipe)
    async createStaffCategory(@Body() staffcategory:CreatestaffcategoryDto){
        return await this.staffcategoryService.createStaffCategory(staffcategory);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe)
    async updateStaffCategory(@Param('id',ParseIntPipe)id:number, @Body() staffcategory:CreatestaffcategoryDto){
        const findstaffcategory=await this.staffcategoryService.updateStaffCategory(id,staffcategory);
        if(!findstaffcategory){
            return new NotFoundException('Category not found.');
        }
        else{
            return findstaffcategory
        }
    }

    @Delete(':id')
    async deleteStaffCategory(@Param('id',ParseIntPipe) id:number){
        const findstaffcategory=await this.staffcategoryService.deleteStaffCategory(id)
        if(!findstaffcategory){
            return new NotFoundException('Category not found.')
        }
        else{
            return findstaffcategory
        }
    }
}

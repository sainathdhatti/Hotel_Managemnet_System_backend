import { Controller, Get, Param, ParseIntPipe, UsePipes, ValidationPipe, NotFoundException, Patch, Body, Delete, Post } from '@nestjs/common';
import { StaffCategoryService } from './staff_category.service';
import { createStaffCategoryDto } from './staff_category.dto';

@Controller('staff_category')
export class StaffCategoryController {
    constructor(private readonly staffCategoryService:StaffCategoryService){}

    @Get()
    async getAllStaffCategory(){
        return await this.staffCategoryService.getAllStaffCategory()
    } 

    @Get(':id')
    @UsePipes(new ValidationPipe()) 
    async getStaffCategoryById(@Param('id', ParseIntPipe) id: number) {
        const findstaffCategory = await this.staffCategoryService.getStaffCategoryById(id);
        if (!findstaffCategory) {
           throw new NotFoundException('Staff Category does not exist');
        }
        return findstaffCategory;
}

    @Post()
    async createstaffCategory(@Body() staffCategoryDetails: createStaffCategoryDto) {
        return await this.staffCategoryService.createstaffCategory(staffCategoryDetails);
    }


    @Patch(':id')
    @UsePipes(new ValidationPipe)
    async updatestaffCategory(@Param('id',ParseIntPipe)id:number, @Body() staffCategoryDetails:createStaffCategoryDto){
        const findstaffCategory=await this.staffCategoryService.updatestaffCategory(id,staffCategoryDetails)
        if(!findstaffCategory){
            throw new NotFoundException('Staff Category does not exist')
        }
        return findstaffCategory
    }

    @Delete(':id')
    @UsePipes(new ValidationPipe)
    async deletestaffCategory(@Param('id',ParseIntPipe)id:number){
        const findstaffCategory=await this.staffCategoryService.deletestaffCategory(id)
        if(!findstaffCategory){
            throw new NotFoundException('Staff Category does not exist')
        }
        return findstaffCategory
    }

    @Get(':name')
    async getStaffCategoryByName(@Param('name')name:string){
        return await this.staffCategoryService.getStaffCategoryByName(name)
    }

}


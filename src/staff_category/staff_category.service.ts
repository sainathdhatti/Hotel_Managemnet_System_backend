import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StaffCategory } from './staff_category.Entity';
import { Repository } from 'typeorm';
import { CreatestaffcategoryDto } from './staff_category.dto';

@Injectable()
export class StaffCategoryService {
    constructor(
        @InjectRepository(StaffCategory) private readonly staffcategoryRepo:Repository<StaffCategory>,
    ){}

    async getAllStaffCategory(){
        return await this.staffcategoryRepo.find()
    }

    async getStaffCategoryById(id:number){
        return await this.staffcategoryRepo.findOneBy({id})
    }

    async createStaffCategory(staffcategory:CreatestaffcategoryDto){
        return await this.staffcategoryRepo.save(staffcategory)
    }

    async updateStaffCategory(id:number, staffcategory:CreatestaffcategoryDto){
        const findstaffcategory=await this.staffcategoryRepo.findOneBy({id})
        if(findstaffcategory){
            const updateStaffCategory={...findstaffcategory, ...staffcategory}
            return await this.staffcategoryRepo.save(updateStaffCategory);
        }
    }


    async deleteStaffCategory(id:number){
        const findstaffcategory=await this.staffcategoryRepo.findOneBy({id})
        if(findstaffcategory){
           return await this.staffcategoryRepo.remove(findstaffcategory)
        }
    }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StaffCategory } from './staff_categoryEntity';
import { Repository } from 'typeorm';
import { createStaffCategoryDto } from './staff_category.dto';

@Injectable()
export class StaffCategoryService {
    constructor(
        @InjectRepository(StaffCategory) private readonly staffCategoyRepo:Repository<StaffCategory>
    ){}

    async getAllStaffCategory(){
        return await this.staffCategoyRepo.find()
    }

    async getStaffCategoryById(id:number){
        return await this.staffCategoyRepo.findOneBy({id})
    }

    async createstaffCategory(staffCategory:createStaffCategoryDto){
        return await this.staffCategoyRepo.save(staffCategory)
    }

    async updatestaffCategory(id:number, staffCategory:createStaffCategoryDto){
        const findstaffCategory=await this.staffCategoyRepo.findOneBy({id})
        if(findstaffCategory){
            return await this.staffCategoyRepo.update(id,staffCategory);
        }
    }

    async deletestaffCategory(id:number){
        const findstaffCategory=await this.staffCategoyRepo.findOneBy({id})
        if(findstaffCategory){
            return await this.staffCategoyRepo.remove(findstaffCategory);
        } 
    }

    async getStaffCategoryByName(name:string){
        const findstaffCategory=await this.staffCategoyRepo.findOne({
            where:{category:name}
        })
        return findstaffCategory
    }

}

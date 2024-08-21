import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StaffMembers } from './staff_membersEntity';
import { Repository } from 'typeorm';
import { createStaffMembersDto } from './dtos/createstaff_members.dto';
import { updateStaffMembersDto } from './dtos/updatestaff_members.dto';
import * as bcrypt from 'bcrypt';
import { StaffCategoryService } from 'src/staff_category/staff_category.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StaffMembersService {
    constructor(@InjectRepository(StaffMembers)private readonly staffmemberRepo:Repository<StaffMembers>,
    private staffCategoryService:StaffCategoryService){}

    async getAllStaffMembers(){
        return await this.staffmemberRepo.find({
            relations:['staffcategory']
        })
        
    }

    async getStaffMemberById(id:number){
        const findstaffmember=await this.staffmemberRepo.findOne({
            where:{id},
            relations:['staffcategory']
        })
        return findstaffmember
    }

    async createStaffMember(staffmemberDetails: createStaffMembersDto) {
        const staffmember=new StaffMembers()
        staffmember.firstName=staffmemberDetails.firstName;
        staffmember.lastName=staffmemberDetails.lastName
        staffmember.phone=staffmemberDetails.phone;
        staffmember.email=staffmemberDetails.email

        staffmember.gender=staffmemberDetails.gender;
        staffmember.staffcategory=staffmemberDetails.staffcategory
        const hashpassword=await bcrypt.hash(staffmemberDetails.password,10)
        staffmember.password=hashpassword

        return await this.staffmemberRepo.save(staffmember)
    }

    async updateStaffMember(id:number, staffmemberDetail:updateStaffMembersDto){
        let staffcategory=null
        if(staffmemberDetail.staffcategory){
            staffcategory=await this.staffCategoryService.getStaffCategoryById(+staffmemberDetail.staffcategory)
        }
        return await this.staffmemberRepo.update(id,{...staffmemberDetail,staffcategory})
    }

    async deleteStaffMember(id:number){
        const findstaffmember=await this.staffmemberRepo.findOneBy({id})
        if(findstaffmember){
            return await this.staffmemberRepo.remove(findstaffmember)
        }
    }
    async findOne(email: string) {
        return this.staffmemberRepo.findOne({ where: { email },relations:['staffcategory']});
    }

}

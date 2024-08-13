import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff_Members } from './staff_members.entity';
import { CreatestaffmembersDto } from './dtos/createstaff_members.dto';
import { UpdatestaffmembersDto } from './dtos/updatestaff_members';
import { StaffCategoryService } from '../staff_category/staff_category.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StaffMembersService {
    constructor(
        @InjectRepository(Staff_Members)
        private readonly staffmemberRepo: Repository<Staff_Members>,
        private readonly staffcategoryService: StaffCategoryService
    ) {}

    async getAllStaffMembers() {
        return await this.staffmemberRepo.find({ relations: ['staffcategory'] });
    }

    async getStaffMemberById(id: number) {
        const staffmember = await this.staffmemberRepo.findOne({
            where: { id },
            relations: ['staffcategory'],
        });
        if (!staffmember) throw new NotFoundException('Staff Member not found');
        return staffmember;
    }

    async createStaffMember(addstaffmembers:CreatestaffmembersDto){
        if(addstaffmembers.password){
            addstaffmembers.password = await bcrypt.hash(addstaffmembers.password, 10);
        }
        const staffmember = new Staff_Members();
        Object.assign(staffmember, addstaffmembers);
        return await this.staffmemberRepo.save(staffmember);
    }

    async updateStaffMember(id:number,updatestaffmember:UpdatestaffmembersDto){
        let findstaffmember=await this.staffmemberRepo.findOneBy({id})
        let staffmember=null
        if(!findstaffmember){
            throw new NotFoundException('Staff Member not found');
        }
        else{
            if(updatestaffmember.password){
                 findstaffmember.password=await bcrypt.hash(updatestaffmember.password, 10);
            }
            if (updatestaffmember.staffcategoryId) {
                const staffCategory = await this.staffcategoryService.getStaffCategoryById(updatestaffmember.staffcategoryId);
                if (!staffCategory) {
                    throw new NotFoundException('Staff Category not found');
                }
                findstaffmember.staffcategory=staffCategory;
            }
            Object.assign(findstaffmember, updatestaffmember);
            return await this.staffmemberRepo.save(findstaffmember)
        }
    }
    
  

    async deleteStaffMember(id: number) {
        const result = await this.staffmemberRepo.delete({ id });
        if (result.affected === 0) throw new NotFoundException('Staff Member not found');
        return 'Staff Member deleted successfully...';
    }

    async findOne(email: string): Promise<Staff_Members | undefined> {
        return this.staffmemberRepo.findOne({ where: { email },relations:['staffcategory'] });
      }
}

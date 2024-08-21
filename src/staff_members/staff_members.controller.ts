import { Controller, Get,Patch, Post,Delete,Param,Body,UsePipes,ValidationPipe,ParseIntPipe, NotFoundException, UseGuards } from '@nestjs/common';
import { StaffMembersService } from './staff_members.service';
import { createStaffMembersDto } from './dtos/createstaff_members.dto';
import { updateStaffMembersDto } from './dtos/updatestaff_members.dto';
import { SpaAuthGuard } from 'src/spa_auth/spa_authGuard';

@Controller('staff_members')
export class StaffMembersController {
    constructor(private readonly staffmemberService:StaffMembersService){}

    @Get()
    async getAllStaffMembers(){
        return await this.staffmemberService.getAllStaffMembers()
    }

    @Get(':id')
    @UsePipes(new ValidationPipe())
    async getStaffMemberById(@Param('id', ParseIntPipe) id: number){
    const findstaffMember = await this.staffmemberService.getStaffMemberById(id);
    if (!findstaffMember) {
      throw new NotFoundException('StaffMember not found');
    }

    return findstaffMember;
  }

    @Post()
    async createStaffMember(@Body()staffmemberDetails:createStaffMembersDto){
        return await this.staffmemberService.createStaffMember(staffmemberDetails) 
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe())
    async updateStaffMember(@Param('id',ParseIntPipe)id:number,@Body()staffmemberDetails:updateStaffMembersDto){
        console.log(staffmemberDetails)
        const findstaffmember=await this.staffmemberService.updateStaffMember(id,staffmemberDetails)
        console.log(findstaffmember)
        if(!findstaffmember){
            throw new NotFoundException('StaffMember not found')
        }
        return findstaffmember
    }

    @Delete(':id')
    @UseGuards(SpaAuthGuard)
    @UsePipes(new ValidationPipe())
    async deleteStaffMember(@Param('id',ParseIntPipe)id:number){
        const findstaffmember=await this.staffmemberService.deleteStaffMember(id)
        if(!findstaffmember){
            throw new NotFoundException('StaffMember not found')
        }
        return findstaffmember
    }
}

import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Put, Post, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { StaffMembersService } from './staff_members.service';
import { CreatestaffmembersDto } from './dtos/createstaff_members.dto';
import { UpdatestaffmembersDto } from './dtos/updatestaff_members';
import { AdminAuthGuard } from 'src/admin_auth/admin_authGuard';

@Controller('staff-members')
@UseGuards(AdminAuthGuard)
export class StaffMembersController {
    constructor(private readonly staffmembersService: StaffMembersService) {}
    
    @Get()
    async getAllStaffMembers() {
        return await this.staffmembersService.getAllStaffMembers();
    }

    @Get(':id')
    async getStaffMemberById(@Param('id', ParseIntPipe) id: number) {
        const staffmember = await this.staffmembersService.getStaffMemberById(id);
        if (!staffmember) {
            throw new NotFoundException('Staff Member not found.');
        }  
        return staffmember;
    }

    @Post()
    @UsePipes(new ValidationPipe)
    async createStaffMember(@Body() staffmember: CreatestaffmembersDto) {
        return await this.staffmembersService.createStaffMember(staffmember);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe)
    async updateStaffMember(@Param('id', ParseIntPipe) id: number, @Body() staffmember: UpdatestaffmembersDto) {
       return await this.staffmembersService.updateStaffMember(id,staffmember);
    }

    @Delete(':id')
    async deleteStaffMember(@Param('id', ParseIntPipe) id: number) {
        const deleteResult = await this.staffmembersService.deleteStaffMember(id);
        if (!deleteResult) {
            throw new NotFoundException('Staff Member not found.');
        }
        return deleteResult;
    }
}

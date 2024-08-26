import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Patch, } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dtos/createadmin.dto';
import { UpdateAdminDto } from './dtos/updateadmin.dto';
import { ForgetPasswordDto } from './dtos/forgetPasswordDto.dto';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService:AdminService){}

    @Get()
    async getAllAdmin(){
        return await this.adminService.getAllAdmin();
    }

    @Get(':id')
    async getAdminById(@Param('id')id:number){
        const findAdmin=await this.adminService.getAdminById(id)
        if(!findAdmin){
            return new NotFoundException('Admin not found ')
        }
        return findAdmin;
    }

    @Post()
    async createAdmin(@Body() adminDetails:CreateAdminDto){
        return await this.adminService.createAdmin(adminDetails);
    }

    @Patch(':id')
    async updateAdmin(@Param('id')id:number, @Body()adminDetails:UpdateAdminDto){
        const findAdmin=await this.adminService.updateAdmin(id,adminDetails)
        if(!findAdmin){
            return new NotFoundException('Admin not found ')
        }
        return findAdmin
    }

    @Delete(':id')
    async deleteAdmin(@Param('id')id:number){
        const findAdmin=await this.adminService.deleteAdmin(id)
        if(!findAdmin){
            return new NotFoundException('Admin not found ')
        }
        return findAdmin 
    }

    @Post('forgetPassword')
    async forgetPasword(@Body() forgetPasswordDto:ForgetPasswordDto){
       return this.adminService.forgetPassword(forgetPasswordDto.email);
  }

    @Post('reset-password')
    async resetPassword(@Body() resetDto: { token: string; newPassword: string }) {
        return this.adminService.resetPassword(resetDto.token, resetDto.newPassword);
    }

}

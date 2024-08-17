import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Patch, UsePipes, ValidationPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dtos/createadmin.dto';
import { UpdateAdminDto } from './dtos/updateadmin.dto';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService:AdminService){}

    @Get()
    async getAllAdmin(){
        return await this.adminService.getAllAdmin();
    }

    @Get(':id')
    @UsePipes(new ValidationPipe)
    async getAdminById(@Param('id',ParseIntPipe)id:number){
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
    @UsePipes(new ValidationPipe)
    async updateAdmin(@Param('id',ParseIntPipe)id:number, @Body()adminDetails:UpdateAdminDto){
        const findAdmin=await this.adminService.updateAdmin(id,adminDetails)
        if(!findAdmin){
            return new NotFoundException('Admin not found ')
        }
        return findAdmin
    }

    @Delete(':id')
    async deleteAdmin(@Param('id',ParseIntPipe)id:number){
        const findAdmin=await this.adminService.deleteAdmin(id)
        if(!findAdmin){
            return new NotFoundException('Admin not found ')
        }
        return findAdmin 
    }
}

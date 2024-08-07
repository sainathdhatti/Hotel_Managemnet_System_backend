import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { CreateSuperAdminDto } from './dtos/create-superadmin.dto';
import { UpdateSuperAdminDto } from './dtos/update-superadmin.dto';

@Controller('super-admin')
export class SuperAdminController {
    constructor(private readonly superAdminService: SuperAdminService) {}
    @Get()

    async getAllSuperAdmins(){
        return await this.superAdminService.getAllSuperAdmins()
    }

    @Post()
    async createSuperAdmin(@Body() superAdmin: CreateSuperAdminDto) {
        return await this.superAdminService.createSuperAdmin(superAdmin);
    }

    @Get('/:id')
    async getSuperAdmin(@Param('id') id: number) {
        return await this.superAdminService.getSuperAdmin(id);
    }

    @Patch('/:id')
    async updateSuperAdmin(@Param('id') id: number, @Body() updateSuperAdminDto: UpdateSuperAdminDto) {
        return await this.superAdminService.updateSuperAdmin(id, updateSuperAdminDto);
    }

    @Delete('/:id')
    async deleteSuperAdmin(@Param('id') id: number) {
        return await this.superAdminService.deleteSuperAdmin(id);
    }
}

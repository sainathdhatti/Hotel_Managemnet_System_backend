import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dtos/createadmin.dto';
import { UpdateAdminDto } from './dtos/updateadmin.dto';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get()
    async getAllAdmin() {
        return this.adminService.getAllAdmin();
    }

    @Get(':id')
    async getAdminById(@Param('id',ParseIntPipe) id: number) {
        const admin = await this.adminService.getAdminById(id);
        if (!admin) {
            throw new NotFoundException(`Admin not found`);
        }
        return admin;
    }

    @Post()
    @UsePipes(new ValidationPipe)
    async createAdmin(@Body() createAdmin: CreateAdminDto) {
        return this.adminService.createAdmin(createAdmin);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe)
    async updateAdmin(@Param('id',ParseIntPipe) id: number, @Body() updateAdmin: UpdateAdminDto) {
        const admin = await this.adminService.updateAdmin(id, updateAdmin);
        if (!admin) {
            throw new NotFoundException(`Admin  not found`);
        }
        return admin;
    }

    @Delete(':id')
    async deleteAdmin(@Param('id', ParseIntPipe) id: number): Promise<void> {
        try {
            await this.adminService.deleteAdmin(id);
            return; 
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }
}

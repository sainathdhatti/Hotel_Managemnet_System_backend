import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuperAdmin } from './superadmin.entity';
import { Repository } from 'typeorm';
import { CreateSuperAdminDto } from './dtos/create-superadmin.dto';
import { UpdateSuperAdminDto } from './dtos/update-superadmin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SuperAdminService {
    constructor(@InjectRepository(SuperAdmin) private superAdminRepo: Repository<SuperAdmin>) {}

    async getAllSuperAdmins(){
        return await this.superAdminRepo.find()
    }

    async createSuperAdmin(createSuperAdminDto: CreateSuperAdminDto) {
        const { email, password } = createSuperAdminDto;

        // Check if the email already exists
        const existingSuperAdmin = await this.superAdminRepo.findOne({ where: { email } });
        if (existingSuperAdmin) {
            throw new ConflictException('Email already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create and save the new SuperAdmin
        const superAdmin = this.superAdminRepo.create({ ...createSuperAdminDto, password: hashedPassword });
        return await this.superAdminRepo.save(superAdmin);
    }

    async getSuperAdmin(id: number){
        const superAdmin = await this.superAdminRepo.findOne({where:{id}});
        if (!superAdmin) {
            throw new NotFoundException(`SuperAdmin with ID ${id} not found`);
        }
        return superAdmin;
    }

    async updateSuperAdmin(id: number, updateSuperAdminDto: UpdateSuperAdminDto){
        const user = await this.superAdminRepo.findOne({ where: { id } });
    
        if (!user) {
            throw new NotFoundException('SuperAdmin not found');
        }
    
        if (updateSuperAdminDto.email) {
            const existingUser = await this.superAdminRepo.findOne({
                where: { email: updateSuperAdminDto.email },
            });
    
            if (existingUser) {
                throw new BadRequestException('Email already exists');
            }
        }
    
        if (updateSuperAdminDto.password) {
            updateSuperAdminDto.password = await bcrypt.hash(updateSuperAdminDto.password, 10);
        }
    
        // Update other fields, including phone
        await this.superAdminRepo.update(id, updateSuperAdminDto);
        
        return "updated successfully";
    
    
    }
    

    async deleteSuperAdmin(id: number){
        const result = await this.superAdminRepo.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`SuperAdmin with ID ${id} not found`);
        }
        return "deleted successfully"
    }
}

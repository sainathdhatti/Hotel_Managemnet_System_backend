import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity'; // Ensure this path is correct
import { CreateAdminDto } from './dtos/createadmin.dto';
import { UpdateAdminDto } from './dtos/updateadmin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepo: Repository<Admin>,
    ) {}

    async getAllAdmin(): Promise<Admin[]> {
        return this.adminRepo.find();
    }


    async getAdminById(id: number): Promise<Admin> {
        const admin = await this.adminRepo.findOneBy({ id });
        if (!admin) {
            throw new NotFoundException(`Admin not found`);
        }
        return admin;
    }


    async createAdmin(addAdmin: CreateAdminDto) {
        if(addAdmin.password){
            addAdmin.password=await bcrypt.hash(addAdmin.password,10)
        }
        const admin=new Admin()
        Object.assign(admin,addAdmin);
        return await this.adminRepo.save(admin)
    }

    async updateAdmin(id: number, updateAdmin: UpdateAdminDto) {
        let findadmin=await this.adminRepo.findOneBy({id})
        let admin=null;
        if(!findadmin){
            throw new NotFoundException('Admin not Found');
        }
        else{
            if(updateAdmin.password){
                findadmin.password=await bcrypt.hash(updateAdmin.password,10)
            }
            Object.assign(findadmin,updateAdmin)
            return await this.adminRepo.save(findadmin);
        }
    }

    async deleteAdmin(id: number): Promise<void> {
        const admin = await this.adminRepo.findOneBy({ id });
        if (!admin) {
            throw new NotFoundException(`Admin not found`);
        }
        await this.adminRepo.remove(admin);
    }
    
    async findOne(email: string) {
        return this.adminRepo.findOne({ where: { email }});
      }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity'; // Ensure this path is correct
import { CreateAdminDto } from './dtos/createadmin.dto';
import { UpdateAdminDto } from './dtos/updateadmin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
   constructor(@InjectRepository(Admin) private readonly adminRepo:Repository<Admin>){}

   async getAllAdmin(){
       return await this.adminRepo.find()
   }

   async getAdminById(id:number){
       return await this.adminRepo.findOneBy({id})
   }

   async createAdmin(adminDetails:CreateAdminDto){
       const hashPassword=await bcrypt.hash(adminDetails.password,10)
       adminDetails.password=hashPassword;
       return await this.adminRepo.save(adminDetails)
   }

   async updateAdmin(id:number, adminDetails:UpdateAdminDto){
      if(adminDetails.password){
          const hashPassword = await bcrypt.hash(adminDetails.password,10) 
          adminDetails.password=hashPassword
      }
      return await this.adminRepo.update(id,adminDetails)
   }

   async deleteAdmin(id:number){
      const findAdmin=await this.adminRepo.findOneBy({id})
      if(findAdmin){
        return await this.adminRepo.remove(findAdmin);
      }
   }
 
   async findOne(email: string){
    return this.adminRepo.findOne({ where: { email } });
  }
}

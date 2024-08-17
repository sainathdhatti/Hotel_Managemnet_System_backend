import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FamilyMember } from './family-members.Entity';
import { Repository } from 'typeorm';
import { CreateFamilyMembersDto } from './family-members.dto';

@Injectable()
export class FamilyMembersService {
    constructor(
        @InjectRepository(FamilyMember) private readonly familymemberRepo:Repository<FamilyMember>,
    ){}

    async getAllFamilyMembers(){
        return await this.familymemberRepo.find()
    }

    async getFamilyMembersById(id:number){
        return await this.familymemberRepo.findOneBy({id})
    }

    async createFamilyMember(familymember:CreateFamilyMembersDto){
        return await this.familymemberRepo.save(familymember)
    }

    async deleteFamilyMember(id:number){
        const findfamilymember=await this.familymemberRepo.findOneBy({id})
        if(findfamilymember){
           return await this.familymemberRepo.remove(findfamilymember)
        }
    }
}

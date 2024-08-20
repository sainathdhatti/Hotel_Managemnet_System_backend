import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FamilyMembers } from './family_membersEntity';
import { Repository } from 'typeorm';
import { createFamily_MemberDto } from './dtos/createfamily_members.dto';
import { updateFamily_MemberDto } from './dtos/updatefamily_members.dto';

@Injectable()
export class FamilyMembersService {
    constructor(@InjectRepository(FamilyMembers)private readonly familymemberRepo:Repository<FamilyMembers>,
){}

    async getAllFamilyMembers(){
        return await this.familymemberRepo.find()
    }

    async getFamilyMemberById(id:number){
        const findmember=await this.familymemberRepo.findOneBy({id})
        return findmember
    }

    async createFamilyMember(createfamilymember:createFamily_MemberDto){
        const familymember=new FamilyMembers()
        familymember.firstName=createfamilymember.firstName
        familymember.lastName=createfamilymember.lastName
        familymember.gender=createfamilymember.gender
        return await this.familymemberRepo.save(familymember)
    }

    async updateFamilyMember(id:number, updatefamilymember:updateFamily_MemberDto){
        const findmember=await this.familymemberRepo.findOneBy({id})
        if(findmember){
            return await this.familymemberRepo.update(id,updatefamilymember)
        } 
    }

    async deleteFamilyMember(id:number){
        const findmember=await this.familymemberRepo.findOneBy({id})
        if(findmember){
           return await this.familymemberRepo.remove(findmember) 
        }
    }
}

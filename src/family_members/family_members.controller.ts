import { Controller, Get, NotFoundException, Param, ParseIntPipe, Post, UsePipes, ValidationPipe,Body, Patch, Delete } from '@nestjs/common';
import { FamilyMembersService } from './family_members.service';
import { createFamily_MemberDto } from './dtos/createfamily_members.dto';
import { updateFamily_MemberDto } from './dtos/updatefamily_members.dto';

@Controller('family-members')
export class FamilyMembersController {
    constructor(private readonly familymemberService:FamilyMembersService){}

    @Get()
    async getAllFamilyMembers(){
        return await this.familymemberService.getAllFamilyMembers()
    }

    @Get(':id')
    @UsePipes(new ValidationPipe())
    async getFamilyMemberById(@Param('id',ParseIntPipe)id:number){
         const findmember=await this.familymemberService.getFamilyMemberById(id)
         if(!findmember){
            throw new NotFoundException('Family Member not exists')
         }
         return findmember
    }

    @Post()
    async createFamilyMember(@Body() familyMemberDto: createFamily_MemberDto) {
        return await this.familymemberService.createFamilyMember(familyMemberDto);
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe())
    async updateFamilyMember(@Param('id',ParseIntPipe)id:number,@Body()familyMember:updateFamily_MemberDto){
        const findmember=await this.familymemberService.updateFamilyMember(id,familyMember)
        if(!findmember){
            throw new NotFoundException('Family Member not exists')
        }
        return findmember
    }

    @Delete(':id')
    @UsePipes(new ValidationPipe)
    async deleteFamilyMember(@Param('id',ParseIntPipe)id:number){
        const findmember=await this.familymemberService.deleteFamilyMember(id)
        if(!findmember){
            throw new NotFoundException('Family Member not exists')
        }
        return findmember
    }

}

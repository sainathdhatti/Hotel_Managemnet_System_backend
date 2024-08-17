import { Body, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Patch, UsePipes, ValidationPipe } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { FamilyMembersService } from './family-members.service';
import { CreateFamilyMembersDto } from './family-members.dto';

@Controller('family-members')
export class FamilyMembersController {

    constructor(private familymemberService:FamilyMembersService){}
    
    @Get()
    async getAllFamilyMembers(){
        return await this.familymemberService.getAllFamilyMembers();
    }

    @Get(':id')
    async getFamilyMembersById(@Param('id',ParseIntPipe) id:number){
          const familymember=await this.familymemberService.getFamilyMembersById(id)
          if(!familymember){
             return new NotFoundException('Family Member not found.')
          }  
          else{
            return familymember;
          }
    }

    @Patch()
    @UsePipes(new ValidationPipe)
    async createFamilyMember(@Body() familymember:CreateFamilyMembersDto){
        return await this.familymemberService.createFamilyMember(familymember);
    }


    @Delete(':id')
    async deleteFamilyMember(@Param('id',ParseIntPipe) id:number){
        const findfamilymember=await this.familymemberService.deleteFamilyMember(id)
        if(!findfamilymember){
            return new NotFoundException('Family Member not found.')
        }
        else{
            return findfamilymember
        }
    }
}

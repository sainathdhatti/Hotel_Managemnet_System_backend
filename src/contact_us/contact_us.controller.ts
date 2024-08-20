import { Controller,Get,Post,Param,Body,Delete,ParseIntPipe,NotFoundException, UsePipes, ValidationPipe,UseGuards } from '@nestjs/common';
import { ContactUsService } from './contact_us.service';
import { createContact_Us_Dto } from './contact_us.dto';
import { AdminAuthGuard } from 'src/admin/admin_auth/admin_authGuard';

@Controller('contact-us')
export class ContactUsController {
    constructor(private contactService:ContactUsService){}

    @Get()
    async getAllContacts(){
        return await this.contactService.getAllContacts();
    }

    @Get(':id')
    async getContactById(@Param('id',ParseIntPipe) id:number){
          const contact=await this.contactService.getContactById(id)
          if(!contact){
             return new NotFoundException('Category not found.')
          }  
          else{
            return contact;
          }
    }

    @Post()
    @UsePipes(new ValidationPipe)
    async createContact(@Body() contact:createContact_Us_Dto){
        return await this.contactService.createContact(contact);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    async deleteContact(@Param('id',ParseIntPipe) id:number){
        const contact=await this.contactService.deleteContact(id)
        if(!contact){
            return new NotFoundException('Category not found.')
        }
        else{
            return contact
        }
    }
}

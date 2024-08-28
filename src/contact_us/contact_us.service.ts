import { Injectable } from '@nestjs/common';
import { Contact_Us } from './contact_us.Entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { createContact_Us_Dto } from './contact_us.dto';

@Injectable()
export class ContactUsService {
    constructor(
        @InjectRepository(Contact_Us) private readonly contactRepo:Repository<Contact_Us>,
    ){}

    async getAllContacts(){
        return await this.contactRepo.find()
    }

    async getContactById(id:number){
        return await this.contactRepo.findOneBy({id})
    }

    async createContact(contact:createContact_Us_Dto){
        console.log(contact)
        return await this.contactRepo.save(contact)
    }

    async deleteContact(id:number){
        const findcontact=await this.contactRepo.findOneBy({id})
        if(findcontact){
           return await this.contactRepo.remove(findcontact)
        }
    }
}

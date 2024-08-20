import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dashboard_Details } from './dashboard_details.Entity';
import { Repository } from 'typeorm';
import { createDashboard_DetailsDto } from './dashboard_details.dto';

@Injectable()
export class DashboardDetailsService {

    constructor(
        @InjectRepository(Dashboard_Details) private readonly dashboardRepo:Repository<Dashboard_Details>,
    ){}

    async getDashboardDetails(){
        return await this.dashboardRepo.find()
    }

    async getDashboardDeatilsById(id:number){
        return await this.dashboardRepo.findOneBy({id})
    }

    async createDashboardDetails(staffcategory:createDashboard_DetailsDto){
        return await this.dashboardRepo.save(staffcategory)
    }

}

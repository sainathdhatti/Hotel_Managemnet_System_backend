import { Controller, Get, Param, Body,Post, NotFoundException,ParseIntPipe } from '@nestjs/common';
import { DashboardDetailsService } from './dashboard_details.service';
import { createDashboard_DetailsDto } from './dashboard_details.dto';

@Controller('dashboard-details')
export class DashboardDetailsController {
    constructor(private dashboardService:DashboardDetailsService){}

    @Get()
    async getDashboardDetails(){
        return await this.dashboardService.getDashboardDetails();
    }

    @Get(':id')
    async getDashboardDeatilsById(@Param('id',ParseIntPipe) id:number){
          const dashboardDetails=await this.dashboardService.getDashboardDeatilsById(id)
          if(!dashboardDetails){
             return new NotFoundException('Details not found.')
          }  
          else{
            return dashboardDetails;
          }
    }

    @Post()
    async createDashboardDetails(@Body() dashboardDetail:createDashboard_DetailsDto){
        return await this.dashboardService.createDashboardDetails(dashboardDetail);
    }
 
}

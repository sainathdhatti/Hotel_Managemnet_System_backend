import { Module } from '@nestjs/common';
import { DashboardDetailsController } from './dashboard_details.controller';
import { DashboardDetailsService } from './dashboard_details.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dashboard_Details } from './dashboard_details.Entity';

@Module({
  imports:[TypeOrmModule.forFeature([Dashboard_Details])],
  controllers: [DashboardDetailsController],
  providers: [DashboardDetailsService]
})
export class DashboardDetailsModule {}

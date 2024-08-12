import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SpaServiceService } from './spa_service.service';
import { CreateSpaServiceDto } from './dtos/createspa_service.dto';
import { UpdateSpaServiceDto } from './dtos/updatespa_service.dto';
import { AdminAuthGuard } from 'src/admin_auth/admin_authGuard';

@Controller('spa-service')
@UseGuards(AdminAuthGuard)
export class SpaServiceController {
    constructor(private readonly spaServiceService: SpaServiceService) {}


  @Get()
  async getAllSpaService() {
    return this.spaServiceService.getAllSpaService();
  }

  @Get(':id')
  async getAllSpaServiceById(@Param('id',ParseIntPipe) id: number) {
    return this.spaServiceService.getAllSpaServiceById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe)
  async createSpaService(@Body() createSpaService: CreateSpaServiceDto) {
    return this.spaServiceService.createSpaService(createSpaService);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe)
  async updateSpaService(@Param('id',ParseIntPipe) id: number, @Body() updateSpaService: UpdateSpaServiceDto) {
    return this.spaServiceService.updateSpaService(id, updateSpaService);
  }

  @Delete(':id')
  async deleteSpaService(@Param('id',ParseIntPipe) id: number): Promise<void> {
    return this.spaServiceService.deleteSpaService(id);
  }
}

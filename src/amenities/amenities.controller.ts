import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
import { CreateAmenitiesDto } from './dtos/create-amenities.dto';
import { UpdateAmenitiesDto } from './dtos/update-amenities.dto';



@Controller('amenities')
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) {}

  @Post()
  // @UseGuards(AdminAuthGuard)
  async createAmenities(@Body() createAmenitiesDto: CreateAmenitiesDto){
    return this.amenitiesService.createAmenities(createAmenitiesDto);
  }

  @Get()
  // @UseGuards(AdminAuthGuard)
  async getAllAmenities() {
    return this.amenitiesService.getAllAmenities();
  }

  @Get(':id')
  async findOneAmenity(@Param('id') id: string) {
    return this.amenitiesService.findOneAmenity(+id);
  }

  @Patch(':id')
  // @UseGuards(AdminAuthGuard)
  async updateAmenity(
    @Param('id') id: string,
    @Body() updateAmenitiesDto: UpdateAmenitiesDto,
  ) {
    return this.amenitiesService.updateAmenity(+id, updateAmenitiesDto);
  }

  @Delete(':id')
  // @UseGuards(AdminAuthGuard)
  async removeAmenity(@Param('id') id: string) {
    return this.amenitiesService.removeAmenity(+id);
  }
}

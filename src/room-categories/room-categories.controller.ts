import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Get,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RoomCategoriesService } from './room-categories.service';
import { CreateRoomCategoryDto } from './dtos/create-roomcategories.dto';
import { UpdateRoomCategoryDto } from './dtos/update-roomcategories.dto';
import { RoomCategories } from './room-categories.entity';
import { SuperAdminAuthGuard } from 'src/superadminauth/superadminauth.gaurd';

@Controller('room-categories')
export class RoomCategoriesController {
  constructor(private readonly roomCategoriesService: RoomCategoriesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createRoomCategory(
    @Body() createRoomCategoryDto: CreateRoomCategoryDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.roomCategoriesService.createRoomCategory(
      createRoomCategoryDto,
      image,
    );
  }
  @UseGuards(SuperAdminAuthGuard)
  @Get()
  async findAllRoomCategories() {
    return this.roomCategoriesService.findAllRoomCategories();
  }

  @Get(':id')
  async findOneRoomCategory(@Param('id') id: number) {
    return this.roomCategoriesService.findOneRoomCategory(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: number,
    @Body() updateRoomCategoryDto: UpdateRoomCategoryDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.roomCategoriesService.updateRoomCategory(
      id,
      updateRoomCategoryDto,
      image,
    );
  }

  @Delete(':id')
  async removeRoomCategory(@Param('id') id: number) {
    return this.roomCategoriesService.removeRoomCategory(id);
  }
}

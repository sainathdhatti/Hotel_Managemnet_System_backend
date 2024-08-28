import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UploadedFile,
  UseInterceptors,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFoodDto } from './dto/createFoodDto';
import { FooditemsService } from './food_itm.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpadateFoodDto } from './dto/upadteFoodDto';

@Controller('fooditem')
export class FooditemsController {
  constructor(private readonly foodService: FooditemsService) {}

  @Post()
  async createFood(@Body() createFoodDto: CreateFoodDto) {
    return await this.foodService.createFood(createFoodDto);
  }

  @Get()
  async listFoods() {
    return this.foodService.getAllFood();
   
  }

  @Get(':id')
  async getFood(@Param('id') id: number) {
    return this.foodService.getFoodById(id);
  }

  @Put(':id')
  async updateFood(
    @Param('id') id: number,
    @Body() updateFoodDto: UpadateFoodDto,
  ) {
    return this.foodService.updateFood(id, updateFoodDto);
  }

  @Delete(':id')
  async deleteFood(@Param('id') id: number) {
   return this.foodService.deleteFood(id);
  }
}

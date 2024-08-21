import { Body, Controller, Get, Post, Put, Delete, UploadedFile, UseInterceptors, Param, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFoodDto } from './dto/createFoodDto';
import { FooditemsService } from './food_itm.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpadateFoodDto } from './dto/upadteFoodDto';

@Controller('fooditem')
export class FooditemsController {
  constructor(
    private readonly foodService: FooditemsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createFood(
    @Body() createFoodDto: CreateFoodDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try { 
      if (!file) {
        throw new HttpException('File not provided', HttpStatus.BAD_REQUEST);
      }

      const uploadResult = await this.cloudinaryService.uploadImage(file);

      const newFood: CreateFoodDto = {
        ...createFoodDto,
        food_image: uploadResult.secure_url,
      };

      const createdFood = await this.foodService.createFood(newFood);
      return createdFood;
    } catch (error) {
      throw new HttpException('Failed to create food item', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async listFoods() {
    try {
      const foods = await this.foodService.getAllFood();
      return foods;
    } catch (error) {
      throw new HttpException('Failed to fetch food items', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getFood(@Param('id') id: number) {
    try {
      const food = await this.foodService.getFoodById(id);
      if (!food) {
        throw new HttpException('Food item not found', HttpStatus.NOT_FOUND);
      }
      return food;
    } catch (error) {
      throw new HttpException('Failed to fetch food item', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateFood(
    @Param('id') id: number,
    @Body() updateFoodDto: UpadateFoodDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const updateData: Partial<CreateFoodDto> = { ...updateFoodDto };

      if (file) {
        const uploadResult = await this.cloudinaryService.uploadImage(file);
        updateData.food_image = uploadResult.secure_url;
      }

      const updatedFood = await this.foodService.updateFood(id, updateData);
      return updatedFood;
    } catch (error) {
      throw new HttpException('Failed to update food item', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async deleteFood(@Param('id') id: number) {
    try {
      await this.foodService.deleteFood(id);
      return { message: 'Food item deleted successfully' };
    } catch (error) {
      throw new HttpException('Failed to delete food item', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

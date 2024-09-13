import { Injectable, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodEntity } from './food_itm.entity';
import { CreateFoodDto } from './dto/createFoodDto';


@Injectable()
export class FooditemsService {
  private readonly logger = new Logger(FooditemsService.name);

  constructor(
    @InjectRepository(FoodEntity)
    private readonly foodRepository: Repository<FoodEntity>,
  ) {}

  async createFood(createFoodDto: CreateFoodDto){
    this.logger.log('Creating a new food item');
    try {
      const food = this.foodRepository.create(createFoodDto);
      const result = await this.foodRepository.save(food);
      this.logger.log(`Food item created with ID ${result.food_id}`);
      return result;
    } catch (error) {
      this.logger.error('Failed to create food item', error.stack);
      throw new InternalServerErrorException('Failed to create food item');
    }
  }

  async getAllFood(){
    this.logger.log('Fetching all food items');
    try {
      const result = await this.foodRepository.find();
      this.logger.log(`Fetched ${result.length} food items`);
      return result;
    } catch (error) {
      this.logger.error('Failed to fetch food items', error.stack);
      throw new InternalServerErrorException('Failed to fetch food items');
    }
  }

  async getFoodById(id: number){
    this.logger.log(`Fetching food item with ID ${id}`);
    try {
      console.log("Getting Food By Id ")
      const food = await this.foodRepository.findOneBy({ food_id: id });
      if (!food) {
        this.logger.warn(`Food item with ID ${id} not found`);
        throw new NotFoundException(`Food item with ID ${id} not found`);
      }
      this.logger.log(`Fetched food item with ID ${id}`);
      return food;
    } catch (error) {
      this.logger.error('Failed to fetch food item', error.stack);
      throw new InternalServerErrorException('Failed to fetch food item');
    }
  }

  async updateFood(food_id: number, updateData: Partial<CreateFoodDto>) {
    this.logger.log(`Updating food item with ID ${food_id}`);
    try {
      const result = await this.foodRepository.update(food_id ,updateData);
  
      if (result.affected === 0) {
        this.logger.warn(`Food item with ID ${food_id} not found for update`);
        throw new NotFoundException(`Food item with ID ${food_id} not found`);
      }
  
      this.logger.log(`Food item with ID ${food_id} updated`);
    } catch (error) {
      this.logger.error('Failed to update food item', error.stack);
      throw new InternalServerErrorException('Failed to update food item');
    }
  }
  

  async deleteFood(id: number): Promise<void> {
    this.logger.log(`Deleting food item with ID ${id}`);
    try {
      const result = await this.foodRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn(`Food item with ID ${id} not found for deletion`);
        throw new NotFoundException(`Food item with ID ${id} not found`);
      }
      this.logger.log(`Food item with ID ${id} deleted`);
    } catch (error) {
      this.logger.error('Failed to delete food item', error.stack);
      throw new InternalServerErrorException('Failed to delete food item');
    }
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { FoodAuthController } from './food_auth.controller';

describe('FoodAuthController', () => {
  let controller: FoodAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodAuthController],
    }).compile();

    controller = module.get<FoodAuthController>(FoodAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { FoodAuthService } from './food_auth.service';

describe('FoodAuthService', () => {
  let service: FoodAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoodAuthService],
    }).compile();

    service = module.get<FoodAuthService>(FoodAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

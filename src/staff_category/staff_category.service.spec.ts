import { Test, TestingModule } from '@nestjs/testing';
import { StaffCategoryService } from './staff_category.service';

describe('StaffCategoryService', () => {
  let service: StaffCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffCategoryService],
    }).compile();

    service = module.get<StaffCategoryService>(StaffCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

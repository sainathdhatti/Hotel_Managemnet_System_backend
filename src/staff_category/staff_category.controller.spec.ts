import { Test, TestingModule } from '@nestjs/testing';
import { StaffCategoryController } from './staff_category.controller';

describe('StaffCategoryController', () => {
  let controller: StaffCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffCategoryController],
    }).compile();

    controller = module.get<StaffCategoryController>(StaffCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

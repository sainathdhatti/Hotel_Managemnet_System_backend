import { Test, TestingModule } from '@nestjs/testing';
import { DashboardDetailsController } from './dashboard_details.controller';

describe('DashboardDetailsController', () => {
  let controller: DashboardDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardDetailsController],
    }).compile();

    controller = module.get<DashboardDetailsController>(DashboardDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

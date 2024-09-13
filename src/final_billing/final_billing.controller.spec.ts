import { Test, TestingModule } from '@nestjs/testing';
import { FinalBillingController } from './final_billing.controller';

describe('FinalBillingController', () => {
  let controller: FinalBillingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinalBillingController],
    }).compile();

    controller = module.get<FinalBillingController>(FinalBillingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

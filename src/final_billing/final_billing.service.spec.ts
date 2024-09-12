import { Test, TestingModule } from '@nestjs/testing';
import { FinalBillingService } from './final_billing.service';

describe('FinalBillingService', () => {
  let service: FinalBillingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinalBillingService],
    }).compile();

    service = module.get<FinalBillingService>(FinalBillingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

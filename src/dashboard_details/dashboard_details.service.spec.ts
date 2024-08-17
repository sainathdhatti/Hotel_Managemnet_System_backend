import { Test, TestingModule } from '@nestjs/testing';
import { DashboardDetailsService } from './dashboard_details.service';

describe('DashboardDetailsService', () => {
  let service: DashboardDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DashboardDetailsService],
    }).compile();

    service = module.get<DashboardDetailsService>(DashboardDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

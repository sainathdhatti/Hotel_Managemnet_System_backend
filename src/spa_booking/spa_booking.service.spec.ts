import { Test, TestingModule } from '@nestjs/testing';
import { SpaBookingService } from './spa_booking.service';

describe('SpaBookingService', () => {
  let service: SpaBookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpaBookingService],
    }).compile();

    service = module.get<SpaBookingService>(SpaBookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

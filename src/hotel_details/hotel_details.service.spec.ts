import { Test, TestingModule } from '@nestjs/testing';
import { HotelDetailsService } from './hotel_details.service';

describe('HotelDetailsService', () => {
  let service: HotelDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HotelDetailsService],
    }).compile();

    service = module.get<HotelDetailsService>(HotelDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

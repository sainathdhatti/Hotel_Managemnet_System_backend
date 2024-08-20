import { Test, TestingModule } from '@nestjs/testing';
import { SpaBookingController } from './spa_booking.controller';

describe('SpaBookingController', () => {
  let controller: SpaBookingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpaBookingController],
    }).compile();

    controller = module.get<SpaBookingController>(SpaBookingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

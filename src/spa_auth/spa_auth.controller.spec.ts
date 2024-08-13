import { Test, TestingModule } from '@nestjs/testing';
import { SpaAuthController } from './spa_auth.controller';

describe('SpaAuthController', () => {
  let controller: SpaAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpaAuthController],
    }).compile();

    controller = module.get<SpaAuthController>(SpaAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { SpaAuthService } from './spa_auth.service';

describe('SpaAuthService', () => {
  let service: SpaAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpaAuthService],
    }).compile();

    service = module.get<SpaAuthService>(SpaAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

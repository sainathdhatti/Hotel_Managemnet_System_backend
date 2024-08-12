import { Test, TestingModule } from '@nestjs/testing';
import { StaffMembersService } from './staff_members.service';

describe('StaffMembersService', () => {
  let service: StaffMembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffMembersService],
    }).compile();

    service = module.get<StaffMembersService>(StaffMembersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { StaffMembersController } from './staff_members.controller';

describe('StaffMembersController', () => {
  let controller: StaffMembersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffMembersController],
    }).compile();

    controller = module.get<StaffMembersController>(StaffMembersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

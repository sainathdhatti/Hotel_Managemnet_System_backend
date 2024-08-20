import { Module } from '@nestjs/common';
import { FamilyMembersController } from './family_members.controller';
import { FamilyMembersService } from './family_members.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyMembers } from './family_membersEntity';

@Module({
  imports:[TypeOrmModule.forFeature([FamilyMembers])],
  controllers: [FamilyMembersController],
  providers: [FamilyMembersService],
  exports:[FamilyMembersService]
})
export class FamilyMembersModule {}

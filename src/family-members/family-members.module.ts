import { Module } from '@nestjs/common';
import { FamilyMembersController } from './family-members.controller';
import { FamilyMembersService } from './family-members.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyMember } from './family-members.Entity';

@Module({
  imports:[TypeOrmModule.forFeature([FamilyMember])],
  controllers: [FamilyMembersController],
  providers: [FamilyMembersService]
})
export class FamilyMembersModule {}

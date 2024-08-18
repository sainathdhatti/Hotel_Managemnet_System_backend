import { Module } from '@nestjs/common';
import { FamilyMembersController } from './family_members.controller';
import { FamilyMembersService } from './family_members.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyMembers } from './family_membersEntity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[TypeOrmModule.forFeature([FamilyMembers]),UserModule],
  controllers: [FamilyMembersController],
  providers: [FamilyMembersService]
})
export class FamilyMembersModule {}

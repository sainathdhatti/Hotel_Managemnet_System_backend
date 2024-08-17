import { Module } from '@nestjs/common';
import { ContactUsController } from './contact_us.controller';
import { ContactUsService } from './contact_us.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact_Us } from './contact_us.Entity';

@Module({
  imports:[TypeOrmModule.forFeature([Contact_Us])],
  controllers: [ContactUsController],
  providers: [ContactUsService]
})
export class ContactUsModule {}

import { Module } from '@nestjs/common';
import { SpaServiceController } from './spa_service.controller';
import { SpaServiceService } from './spa_service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaService } from './spa_service.Entity';

@Module({
  imports:[TypeOrmModule.forFeature([SpaService])],
  controllers: [SpaServiceController],
  providers: [SpaServiceService]
})
export class SpaServiceModule {}

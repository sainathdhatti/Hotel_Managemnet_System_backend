import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffMembersModule } from './staff_members/staff_members.module';
import { Staff_Members } from './staff_members/staff_members.Entity';
import { StaffCategoryModule } from './staff_category/staff_category.module';
import { StaffCategory } from './staff_category/staff_category.Entity';
import { SpaServiceModule } from './spa_service/spa_service.module';
import { SpaService } from './spa_service/spa_service.Entity';
import { TimeSlotModule } from './time_slot/time_slot.module';
import { TimeSlot } from './time_slot/time_slot.Entity';
import { SpaBookingModule } from './spa_booking/spa_booking.module';
import { SpaAuthModule } from './spa_auth/spa_auth.module';
import { AdminModule } from './admin/admin.module';
import { Admin } from './admin/admin.entity';
import { AdminAuthModule } from './admin_auth/admin_auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT'), 10),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
        entities: [StaffCategory,Staff_Members,SpaService,TimeSlot,Admin],
      }),
      inject: [ConfigService],
    }),
    StaffMembersModule,
    StaffCategoryModule,
    SpaServiceModule,
    TimeSlotModule,
    SpaBookingModule,
    SpaAuthModule,
    AdminModule,
    AdminAuthModule
],
  controllers: [AppController], 
  providers: [AppService], 

})
export class AppModule {}

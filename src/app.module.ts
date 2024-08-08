import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SuperAdminModule } from './super-admin/super-admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperAdmin } from './super-admin/superadmin.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AmenitiesModule } from './amenities/amenities.module';
import { Amenities } from './amenities/amenities.entity';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { RoomCategoriesModule } from './room-categories/room-categories.module';
import { RoomCategories } from './room-categories/room-categories.entity';
import { RoomsModule } from './rooms/rooms.module';
import { Room } from './rooms/rooms.entity';

@Module({
  imports: [SuperAdminModule,
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type:'mysql', // Explicitly cast the type
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [SuperAdmin,Amenities,RoomCategories,Room],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AmenitiesModule,
    CloudinaryModule,
    RoomCategoriesModule,
    RoomsModule,
  ],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
})
export class AppModule {}

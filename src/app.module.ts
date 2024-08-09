import { Module } from '@nestjs/common';

import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SuperAdminModule } from './super-admin/super-admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperAdmin } from './super-admin/superadmin.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FoodEntity } from './Food_module/Food_items/food_itm.entity';
import { diskStorage } from 'multer';
import path from 'path';

import { Room } from './rooms/rooms.entity';
import { RoomCategories } from './room-categories/room-categories.entity';
import { Amenities } from './amenities/amenities.entity';
import { AmenitiesModule } from './amenities/amenities.module';
import { RoomsModule } from './rooms/rooms.module';
import { RoomCategoriesModule } from './room-categories/room-categories.module';
import { Food_itemsModule } from './Food_module/Food_items/food_itm.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UserEntity } from './user/user.entity';
import { UserModule } from './user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './user/Auth/CustomerAuth/Auth.module';
import { SuperAdminAuthModule } from './superadminauth/superadminauth.module';


@Module({
  imports: [
    SuperAdminModule,
    AmenitiesModule,
    RoomsModule,
    RoomCategoriesModule,
    Food_itemsModule,
    CloudinaryModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule global
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
<<<useFactory: (configService: ConfigService) => ({
  type: 'mysql', // Explicitly cast the type
  host: configService.get<string>('DATABASE_HOST') || configService.get<string>('DB_HOST'),
  port: configService.get<number>('DATABASE_PORT') || configService.get<number>('DB_PORT'),
  username: configService.get<string>('DATABASE_USER') || configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DATABASE_PASSWORD') || configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME') || configService.get<string>('DB_NAME'),
  entities: [UserEntity, SuperAdmin, Room, RoomCategories, Amenities, FoodEntity],

      synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      FoodEntity,
      RoomCategories,
      Amenities,
      Room,
      SuperAdmin,
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename: string =
            path.parse(file.originalname).name.replace(/\s/g, '') +
            path.extname(file.originalname);
          cb(null, `${filename}`);
        },
      }),
    }),
imports: [
  MailerModule.forRoot({
    transport: {
      host: process.env.Email_Host,
      port: Number(process.env.Email_Port),
      secure: process.env.Email_Secure === 'true', // false for TLS
      auth: {
        user: process.env.Email,
        pass: process.env.PASSWORD,
      },
    },
    defaults: {
      from: `"Your Name" <${process.env.Email}>`,
    },
  }),
  Food_itemsModule,
  CloudinaryModule,
  UserModule,
  SuperAdminAuthModule,
],
controllers: [AppController],
providers: [AppService],

export class AppModule {}

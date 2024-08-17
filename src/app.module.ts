import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { SpaServiceModule } from './spa_service/spa_service.module';
import { SpaService } from './spa_service/spa_service.Entity';
import { TimeSlotModule } from './time_slot/time_slot.module';
import { TimeSlot } from './time_slot/time_slot.Entity';
// import { SpaAuthModule } from './spa_auth/spa_auth.module';
import { AdminModule } from './admin/admin.module';
import { Admin } from './admin/admin.entity';
import { AdminAuthModule } from './admin/admin_auth/admin_auth.module';
import { FoodEntity } from './Food_module/Food_items/food_itm.entity';
import { Food_itemsModule } from './Food_module/Food_items/food_itm.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UserEntity } from './user/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './user/Auth/CustomerAuth/Auth.module';
import { FoodOrder } from './Food_module/Food_order/Food_order.entity';
import { OrderItem } from './Food_module/Food_order/foodorderItem.entity';
import { OrderModule } from './Food_module/Food_order/food_order.module';
import { Amenities } from './amenities/amenities.entity';
import { AmenitiesModule } from './amenities/amenities.module';
import { Room } from './rooms/rooms.entity';
import { RoomsModule } from './rooms/rooms.module';
import { RoomCategories } from './room-categories/room-categories.entity';
import { RoomCategoriesModule } from './room-categories/room-categories.module';
import { SuperAdmin } from './super-admin/superadmin.entity';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { SuperAdminAuthModule } from './superadminauth/superadminauth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StaffCategoryModule } from './staff_category/staff_category.module';
import { StaffCategory } from './staff_category/staff_categoryEntity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST') || configService.get('DB_HOST'),
        port: configService.get<number>('DATABASE_PORT') || parseInt(configService.get('DB_PORT'), 10),
        username: configService.get<string>('DATABASE_USER') || configService.get('DB_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD') || configService.get('DB_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME') || configService.get('DB_DATABASE'),
        entities: [
          FoodOrder,
          FoodEntity,
          UserEntity,
          OrderItem,
          Amenities,
          Room,
          RoomCategories,
          SuperAdmin,
          Admin,
          StaffCategory
        ],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE') ?? true,
      }),
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + path.extname(file.originalname);
          cb(null, `${filename}`);
        },
      }),
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.Email_Host,
        port: Number(process.env.Email_Port),
        secure: process.env.Email_Secure === 'true',
        auth: {
          user: process.env.Email,
          pass: process.env.PASSWORD,
        },
      },
      defaults: {
        from: `"Your Name" <${process.env.Email}>`,
      },
    }),
    SpaServiceModule,
    TimeSlotModule,
    // SpaAuthModule,
    AdminModule,
    AdminAuthModule,
    Food_itemsModule,
    CloudinaryModule,
    UserModule,
    AuthModule,
    OrderModule,
    AmenitiesModule,
    RoomsModule,
    RoomCategoriesModule,
    SuperAdminModule,
    SuperAdminAuthModule,
    StaffCategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
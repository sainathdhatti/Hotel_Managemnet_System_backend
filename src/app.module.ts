import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Modules
import { StaffCategoryModule } from './staff_category/staff_category.module';
import { SpaServiceModule } from './spa_service/spa_service.module';
import { TimeSlotModule } from './time_slot/time_slot.module';
import { AdminModule } from './admin/admin.module';
import { AdminAuthModule } from './admin/admin_auth/admin_auth.module';
import { Food_itemsModule } from './Food_module/Food_items/food_itm.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './user/Auth/CustomerAuth/Auth.module';
import { OrderModule } from './Food_module/Food_order/food_order.module';
import { AmenitiesModule } from './amenities/amenities.module';
import { RoomsModule } from './rooms/rooms.module';
import { RoomCategoriesModule } from './room-categories/room-categories.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { SuperAdminAuthModule } from './superadminauth/superadminauth.module';
import { StaffMembersModule } from './staff_members/staff_members.module';
import { SpaBookingModule } from './spa_booking/spa_booking.module';
import { SpaAuthModule } from './spa_auth/spa_auth.module';
import { FoodAuthModule } from './food_module/food_auth/food_auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { Booking } from './bookings/bookings.Entity';
import { Admin } from './admin/admin.entity';
import { FoodEntity } from './Food_module/Food_items/food_itm.entity';
import { FoodOrder } from './Food_module/Food_order/Food_order.entity';
import { OrderItem } from './Food_module/Food_order/foodorderItem.entity';
import { Amenities } from './amenities/amenities.entity';
import { ContactUsModule } from './contact_us/contact_us.module';
import { RoomCategories } from './room-categories/room-categories.entity';
import { Room } from './rooms/rooms.entity';
import { SpaAuthGuard } from './spa_auth/spa_authGuard';
import { SpaBooking } from './spa_booking/spa_bookingEntity';
import { SpaService } from './spa_service/spa_service.Entity';
import { StaffCategory } from './staff_category/staff_categoryEntity';
import { StaffMembers } from './staff_members/staff_membersEntity';
import { SuperAdmin } from './super-admin/superadmin.entity';
import { TimeSlot } from './time_slot/time_slot.Entity';
import { UserEntity } from './user/user.entity';
import { Contact_Us } from './contact_us/contact_us.Entity';
import { ReviewsModule } from './reviews/reviews.module';
import { Review } from './reviews/reviews.entity';




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
          StaffCategory,
          StaffMembers,
          SpaService,
          TimeSlot,
          SpaBooking,
          Booking,
          SpaAuthGuard,
          Contact_Us,
          Review
        ],
        synchronize: true, // Use with caution in production
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
    SpaAuthModule,
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
    BookingsModule,
    StaffMembersModule,
    SpaBookingModule,
    FoodAuthModule,
    ContactUsModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule {}

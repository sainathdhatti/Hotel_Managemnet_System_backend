import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { diskStorage } from 'multer';
import * as path from 'path';
import { FoodEntity } from './Food_module/Food_items/food_itm.entity';
import { Food_itemsModule } from './Food_module/Food_items/food_itm.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UserEntity } from './user/user.entity';
import { UserModule } from './user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './user/Auth/CustomerAuth/Auth.module';
import { FoodOrder } from './Food_module/Food_order/Food_order.entity';
import { OrderItem } from './Food_module/Food_order/foodorderItem.entity';
import { OrderModule } from './Food_module/Food_order/food_order.module';

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
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities:[FoodOrder, FoodEntity, UserEntity,OrderItem],
        synchronize: true,
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
    Food_itemsModule,
    CloudinaryModule,
    UserModule,
    AuthModule,
    FoodOrder,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

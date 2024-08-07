import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SuperAdminModule } from './super-admin/super-admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperAdmin } from './super-admin/superadmin.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [SuperAdminModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule global
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
        entities: [SuperAdmin],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

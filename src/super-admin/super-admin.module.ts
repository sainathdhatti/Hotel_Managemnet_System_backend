import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperAdmin } from './superadmin.entity';
import { SuperAdminController } from './super-admin.controller';
import { SuperAdminService } from './super-admin.service';

@Module({
    imports:[TypeOrmModule.forFeature([SuperAdmin])],
    controllers:[SuperAdminController],
    providers:[SuperAdminService],
    exports:[SuperAdminService]
})
export class SuperAdminModule {}

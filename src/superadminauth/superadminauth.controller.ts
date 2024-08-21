import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';

import { SuperAdminAuthService } from './superadminauth.service';
import { SuperAdminAuthGuard } from './superadminauth.gaurd';
import { LoginDto } from './dto/superadminlogin.dto';

@Controller('superadminlogin')
export class SuperAdminAuthController {
  constructor(private readonly superAdminAuthService: SuperAdminAuthService) {}
  @Post('login')
  async signIn(@Body() user: LoginDto) {
    return this.superAdminAuthService.signIn(user);
  }
  @UseGuards(SuperAdminAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  @Post('logout')
  async logout() {
    return this.superAdminAuthService.logout();
  }
}

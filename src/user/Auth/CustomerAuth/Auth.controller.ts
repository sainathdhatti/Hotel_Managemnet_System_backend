import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
    Request
  } from '@nestjs/common';
import { SignInDto } from './dto/SignIn.dto';
import { AuthService } from './Auth.service';
import { AuthGuard } from './AuthGuard.guard';
  
  
  @Controller('userlogin')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: SignInDto) {
      return await this.authService.signIn(signInDto);
    }
  
    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
      return await req.user;
    }
    @Post('logout')
    async logout(){
      return this.authService.logout();
    }
  }
  
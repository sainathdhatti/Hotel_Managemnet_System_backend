import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AdminAuthService } from './admin_auth.service';
import { SignInDto } from './dto/SignIn.dto';

@Controller('adminlogin')
export class AdminAuthController {
    constructor(private authService: AdminAuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}

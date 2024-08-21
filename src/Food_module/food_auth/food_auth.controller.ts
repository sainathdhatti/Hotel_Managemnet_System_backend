import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { FoodAuthService } from './food_auth.service';

@Controller('foodlogin')
export class FoodAuthController {
    constructor(private authService: FoodAuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
}

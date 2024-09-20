import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ReceptionistAuthService } from './receptionist_auth.service';


@Controller('receptionistlogin')
export class ReceptionistAuthController {
    constructor(private receptionistService: ReceptionistAuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.receptionistService.signIn(signInDto.email, signInDto.password);
  }
}

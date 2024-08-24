import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/admin/admin.service';
import { SignInDto } from './dto/SignIn.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AdminAuthService {
    constructor(
        private adminService: AdminService,
        private jwtService: JwtService,
      ) {}
    
      async signIn(signInDto: SignInDto){
        const admin = await this.adminService.findOne(signInDto.email);
        if (!admin) {
          throw new UnauthorizedException('Invalid admin');
        }
        const hashpassword=await bcrypt.compare(signInDto.password,admin.password)
        if (!hashpassword) {
          throw new UnauthorizedException('Invalid Password');
        }
        const { password, ...result } = admin;
    
        return {
          access_token: await this.jwtService.signAsync(result),
        };
      } 
      logout() {
        return `logout Sucessufully`;
      }
}

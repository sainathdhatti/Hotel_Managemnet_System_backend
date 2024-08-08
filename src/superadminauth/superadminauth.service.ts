import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

import { SuperAdminService } from 'src/super-admin/super-admin.service';
import { LoginDto } from './dto/superadminlogin.dto';

@Injectable()
export class SuperAdminAuthService {
  constructor(
    private superAdminService: SuperAdminService,
    private jwtService: JwtService,
  ) {}

  async signIn(user: LoginDto) {
    try {
      const userDetails = await this.superAdminService.findByEmail(user.email);

      if (!userDetails) {
        throw new UnauthorizedException('Invalid email');
      }

      const passwordMatch = await compare(user.password, userDetails.password);

      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid password');
      }

      const { password, ...result } = userDetails;

      return {
        access_token: await this.jwtService.signAsync(result),
      };
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }
  }
  async logout() {
    return { message: 'Successfully logged out' };
  }
}

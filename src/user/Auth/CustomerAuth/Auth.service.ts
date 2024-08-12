import { Injectable, UnauthorizedException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/SignIn.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto){
    const user = await this.userService.findEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }
    const passwordMatch = await bcrypt.compare(
      signInDto.passwordHash,
      user.passwordHash,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid Password');
    }
    const { passwordHash, ...result } = user;

    return {
      access_token: await this.jwtService.signAsync(result),
    };
  }
  logout() {
    return `logout Sucessufully`;
  }
}

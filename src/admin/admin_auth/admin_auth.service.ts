import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class AdminAuthService {
    constructor(
        private adminService: AdminService,
        private jwtService: JwtService,
      ) {}
    
      async signIn(email: string, password: string): Promise<any> {
        const admin = await this.adminService.findOne(email);
        console.log(admin);
        if (!admin) {
          throw new UnauthorizedException('Admin Member not found');
        }
    
        if (!admin.password) {
          throw new ForbiddenException('Password not found for the Admin');
        }
    
        const isAdmin = admin.email===process.env.ADMIN_EMAIL && 
                        admin.password===process.env.ADMIN_PASSWORD_HASH
        console.log(isAdmin)
        if (!isAdmin) {
            throw new ForbiddenException('Access restricted to spa staff only');
        }

        const payload = { id: admin.id, email: admin.email, password:admin.password };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
      }
}

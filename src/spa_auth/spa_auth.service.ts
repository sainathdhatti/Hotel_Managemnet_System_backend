import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StaffMembersService } from 'src/staff_members/staff_members.service';
const bcrypt = require('bcrypt');

@Injectable()
export class SpaAuthService {
    constructor(
        private staffmembersService: StaffMembersService,
        private jwtService: JwtService,
      ) {}
    
      async signIn(email: string, password: string): Promise<any> {
        const staffmember = await this.staffmembersService.findOne(email);
        console.log(staffmember);
        if (!staffmember) {
          throw new UnauthorizedException('Spa Member not found');
        }
    
        if (!staffmember.password) {
          throw new ForbiddenException('Password not found for the Spa Member');
        }
    
        const passwordsMatch = await bcrypt.compare(password, staffmember.password);
        if (!passwordsMatch) {
          throw new UnauthorizedException('Invalid Password');
        }
        // const isSpaStaff = staffmember.staffcategory.category==="SpaStaff"
        // console.log(isSpaStaff)
        // if (!isSpaStaff) {
        //     throw new ForbiddenException('Access restricted to spa staff only');
        // }

        const payload = { id: staffmember.id, email: staffmember.email, staffcategory: staffmember.staffcategory };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
      }
}

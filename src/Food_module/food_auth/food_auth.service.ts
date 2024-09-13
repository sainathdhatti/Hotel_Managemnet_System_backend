import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StaffMembersService } from 'src/staff_members/staff_members.service';
const bcrypt = require('bcrypt');

@Injectable()
export class FoodAuthService {
    constructor(
        private staffmembersService: StaffMembersService,
        private jwtService: JwtService,
      ) {}
    
      async signIn(email: string, password: string): Promise<any> {
        const staffmember = await this.staffmembersService.findOne(email);
        console.log(staffmember);
        if (!staffmember) {
          throw new UnauthorizedException('Food Member not found');
        }
    
        if (!staffmember.password) {
          throw new ForbiddenException('Password not found for the Food Member');
        }
    
        const passwordsMatch = await bcrypt.compare(password, staffmember.password);
        if (!passwordsMatch) {
          throw new UnauthorizedException('Invalid Password');
        }
        console.log(staffmember.staffcategory.category);
        
        const isSpaStaff = staffmember.staffcategory.category==="CookStaff"
        console.log(isSpaStaff)
        if (!isSpaStaff) {
            throw new ForbiddenException('Access restricted to Cook staff only');
        }
        // Check if staffcategory and category exist
        console.log(staffmember)

        const payload = { id: staffmember.id, email: staffmember.email, staffcategory: staffmember.staffcategory };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
      }
}

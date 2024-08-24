import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { CreateAdminDto } from './dtos/createadmin.dto';
import { UpdateAdminDto } from './dtos/updateadmin.dto';
import * as bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AdminService {
   private readonly logger = new Logger(AdminService.name);
   constructor(@InjectRepository(Admin) private readonly adminRepo:Repository<Admin>,
   private mailerService: MailerService,
  ){}

   async getAllAdmin(){
       return await this.adminRepo.find()
   }

   async getAdminById(id:number){
       return await this.adminRepo.findOneBy({id})
   }

   async createAdmin(adminDetails:CreateAdminDto){
       const hashPassword=await bcrypt.hash(adminDetails.password,10)
       adminDetails.password=hashPassword;
       return await this.adminRepo.save(adminDetails)
   }

   async updateAdmin(id:number, adminDetails:UpdateAdminDto){
      if(adminDetails.password){
          const hashPassword = await bcrypt.hash(adminDetails.password,10) 
          adminDetails.password=hashPassword
      }
      return await this.adminRepo.update(id,adminDetails)
   }

   async deleteAdmin(id:number){
      const findAdmin=await this.adminRepo.findOneBy({id})
      if(findAdmin){
        return await this.adminRepo.remove(findAdmin);
      }
   }
 
   async findOne(email: string){
    return this.adminRepo.findOne({ where: { email } });
  }

  

  async forgetPassword(email: string): Promise<void> {
    // Check if the user exists
    const user = await this.adminRepo.findOne({ where: { email } });
    if (!user) {
      this.logger.warn(`User with email ${email} not found`);
      throw new NotFoundException('User not found');
    }

    // Generate a password reset token
    const token = nanoid(64);
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 3600000);

    // Save the token and expiry to the user record
    await this.adminRepo.save(user);

    // Create a password reset URL
    const resetUrl = `http://yourfrontend.com/reset-password?token=${token}`;

    // Send the password reset email
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      text: `To reset your password, please click the following link: ${resetUrl}`,
      html: `<p>To reset your password, please click the following link: <a href="${resetUrl}">${resetUrl}</a></p>`,
    });

    this.logger.log(`Password reset email sent to ${email}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Find the user by reset token
    const admin = await this.adminRepo.findOne({
      where: { resetToken: token },
    });
    
    if (!admin || admin.resetTokenExpiry < new Date()) {
      this.logger.warn(`Invalid or expired token for ${token}`);
      throw new BadRequestException('Invalid or expired token');
    }

    // Hash the new password and update the user's password
    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetToken = null;
    admin.resetTokenExpiry = null;

    // Save the updated user record
    await this.adminRepo.save(admin);
    this.logger.log('Password has been reset successfully');
  }
}

import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/CreateUserDto.dto';
import { UpdateUserDto } from './dto/UpdateUserDto.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { nanoid } from 'nanoid';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private mailerService: MailerService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existingUser) {
      this.logger.warn(`Email ${createUserDto.email} already in use`);
      throw new ConflictException('Email already in use');
    }

    const password = await bcrypt.hash(createUserDto.password, 10);
    const user = {
      ...createUserDto,
      password,
    };

    await this.userRepository.save(user);
    this.logger.log(
      `User with email ${createUserDto.email} created successfully`,
    );

    await this.sendWelcomeEmail(user.email, user.firstName);
    this.logger.log(`Welcome email sent to ${user.email}`);

    return user;
  }

  async sendWelcomeEmail(email: string, firstName: string) {
    const subject = `Welcome to Hotel Enhance, ${firstName}! 🌟`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
          <h1 style="color: #e74c3c;">Welcome to Hotel Enhance, ${firstName}!</h1>
        </div>
        <div style="background-color: #ffffff; padding: 20px; text-align: center;">
          <p style="font-size: 18px;">
            Dear ${firstName},
          </p>
          <p style="font-size: 16px;">
            We're delighted to welcome you to Hotel Enhance! 🏨 We are excited to have you as a part of our community and are committed to making your stay with us exceptional.
          </p>
          <p style="font-size: 16px;">
            Our team is dedicated to providing you with top-notch service and ensuring your comfort throughout your stay. Should you need any assistance or have any special requests, please don't hesitate to reach out to us.
          </p>
          <p style="font-size: 16px;">
            We hope you enjoy your time with us and make the most of our amenities and services. For more information about our hotel and what we offer, visit our website or contact our front desk team.
          </p>
          <p style="font-size: 16px;">
            Warm regards,<br />
            The Hotel Enhance Team
          </p>
          <div style="margin-top: 20px;">
            <a href="https://yourdomain.com" style="text-decoration: none; color: #ffffff; background-color: #e74c3c; padding: 10px 20px; border-radius: 5px; font-size: 16px;">Explore Our Hotel</a>
          </div>
        </div>
      </div>
    `;

    await this.mailerService.sendMail({
      to: email,
      subject,
      html: htmlContent,
    });

    this.logger.log(`Welcome email successfully sent to ${email}`);
  }

  async getAllUsers() {
    this.logger.log('Fetching all users');
    const users = await this.userRepository.find();
    if (!users) {
      this.logger.warn('No users found');
      throw new NotFoundException('Users not found');
    }
    this.logger.log(`Found ${users.length} users`);
    return users;
  }

  async getUser(id: number) {
    this.logger.log(`Fetching user with ID ${id}`);
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException('User not found');
    }
    this.logger.log(`User with ID ${id} found`);
    return user;
  }

  async updateUser(id: number, updateDto: UpdateUserDto) {
    let user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    if (updateDto.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateDto.email },
      });
      if (existingUser && existingUser.id !== id) {
        this.logger.warn(`Email ${updateDto.email} already in use`);
        throw new ConflictException('Email already exists');
      }
    }

    if (updateDto.password) {
      updateDto.password = await bcrypt.hash(updateDto.password, 10);
    }

    user = { ...user, ...updateDto };

    await this.userRepository.save(user);
    this.logger.log(`User with ID ${id} updated successfully`);
    return user;
  }

  async deleteUser(id: number) {
    const user = await this.getUser(id);
    await this.userRepository.remove(user);
    this.logger.log(`User with ID ${id} deleted successfully`);
  }

  async findEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async forgetPassword(email: string): Promise<void> {
    // Check if the user exists
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      this.logger.warn(`User with email ${email} not found`);
      throw new NotFoundException('User not found');
    }

    // Generate a password reset token
    const token = nanoid(64);
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // Token valid for 1 hour

    // Save the token and expiry to the user record
    await this.userRepository.save(user);

    // Create a password reset URL
    const resetUrl = `http://localhost:3000/resetpassword?token=${token}`;

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
    const user = await this.userRepository.findOne({
      where: { resetToken: token },
    });

    if (!user || user.resetTokenExpiry < new Date()) {
      this.logger.warn(`Invalid or expired token for ${token}`);
      throw new BadRequestException('Invalid or expired token');
    }

    // Hash the new password and update the user's password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;

    // Save the updated user record
    await this.userRepository.save(user);
    this.logger.log('Password has been reset successfully');
  }
}

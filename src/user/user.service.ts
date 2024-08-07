import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/CreateUserDto.dto';
import { UpdateUserDto } from './dto/UpdateUserDto.dto'; 
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private mailerService: MailerService,
  ) {}

  async createUser(createUserDto: CreateUserDto){
    
    const existingUser = await this.userRepository.findOneBy({ email: createUserDto.email });
    if (existingUser) {
      this.logger.warn(`Email ${createUserDto.email} already in use`);
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    const user = {
      ...createUserDto,
      passwordHash,
    };

    await this.userRepository.save(user);
    this.logger.log(`User with email ${createUserDto.email} created successfully`);

    
    await this.sendWelcomeEmail(user.email, user.name);
    this.logger.log(`Welcome email sent to ${user.email}`);

    return user;
  }

  async sendWelcomeEmail(email: string, name: string) {
    const subject = `Welcome to Hotel Services, ${name}!`;
    const textContent = `Dear ${name},\n\nWelcome to Movie Rentals! We're thrilled to have you as a member of our community.\n\nEnjoy your time with us!\n\nBest regards,\nThe Movie Rentals Team`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      text: textContent,
    });
    this.logger.log(`Welcome email successfully sent to ${email}`);
  }

  async getAllUsers(){
    this.logger.log('Fetching all users');
    const users = await this.userRepository.find();
    if (!users) {
      this.logger.warn('No users found');
      throw new NotFoundException('Users not found');
    }
    this.logger.log(`Found ${users.length} users`);
    return users;
  }

  async getUser(id: number){
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
      const existingUser = await this.userRepository.findOne({ where: { email: updateDto.email } });
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
  

  async deleteUser(id: number){
    const user = await this.getUser(id);
    await this.userRepository.remove(user);
    this.logger.log(`User with ID ${id} deleted successfully`);
  }

  async findEmail(email: string){
    return await this.userRepository.findOne({ where: { email } });
  }
}

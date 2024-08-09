import { Controller, Post, Get, Put, Delete, Body, Param, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/CreateUserDto.dto';
import { UpdateUserDto } from './dto/UpdateUserDto.dto';
import { AuthGuard } from './Auth/CustomerAuth/AuthGuard.guard';



@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllUsers(){
    return this.userService.getAllUsers();
  }
  @Get(':id')
  @UseGuards(AuthGuard)
  async getUser(@Param('id') id: number) {
    return this.userService.getUser(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    await this.userService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
}

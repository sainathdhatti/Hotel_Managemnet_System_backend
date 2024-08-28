import { Controller, Post, Get, Put, Delete, Body, Param,  UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/CreateUserDto.dto';
import { UpdateUserDto } from './dto/UpdateUserDto.dto';
import { AuthGuard } from './Auth/CustomerAuth/AuthGuard.guard';
import { ForgetPasswordDto } from './dto/forgetPasswordDto.dto';



@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  // @UseGuards(AuthGuard)
  async getAllUsers(){
    return this.userService.getAllUsers();
  }
  @Get(':id')
  // @UseGuards(AuthGuard)
  async getUser(@Param('id') id: number) {
    return this.userService.getUser(id);
  }

  @Put(':id')
  // @UseGuards(AuthGuard)
  async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    await this.userService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }

  @Post('forgetPassword')
  async forgetPasword(@Body() forgetPasswordDto:ForgetPasswordDto){
    return this.userService.forgetPassword(forgetPasswordDto.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetDto: { token: string; newPassword: string }) {
    return this.userService.resetPassword(resetDto.token, resetDto.newPassword);
  }

}

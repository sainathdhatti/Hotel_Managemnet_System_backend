import { Controller, Post, Get, Param, Body, Put, Delete, HttpException, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateBookingDto } from './dto/createBookindDto.dto';
import { UpdateBookingDto } from './dto/updateBookingDto.dto';
import { BookingsService } from './booking.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      return await this.bookingsService.createBooking(createBookingDto, file);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async getAllBookings() {
    try {
      return await this.bookingsService.getAllBookings();
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getBookingById(@Param('id') id: number) {
    try {
      return await this.bookingsService.getBookingById(id);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateBooking(
    @Param('id') id: number,
    @Body() updateBookingDto: UpdateBookingDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      return await this.bookingsService.updateBooking(id, updateBookingDto, file);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async deleteBooking(@Param('id') id: number) {
    try {
      return await this.bookingsService.deleteBooking(id);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

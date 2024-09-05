import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dtos/createBookings.dto';
import { UpdateBookingDto } from './dtos/updateBookings.dto';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async createBooking(@Body() createBookingDto: CreateBookingDto) {
    try {
      return await this.bookingsService.createBooking(createBookingDto);
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
  @UsePipes(new ValidationPipe())
  async getBookingById(@Param('id',ParseIntPipe) id: number) {
    try {
      return await this.bookingsService.getBookingById(id);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.NOT_FOUND);
    }
  }

  @Get('users/:userid')
  @UsePipes(new ValidationPipe())
  async getBookingByCustomerId(@Param('userid', ParseIntPipe) userid: number) {
    console.log("hello World");
  try {
    return await this.bookingsService.getBookingCustomerById(userid);
  } catch (error) {
    throw new HttpException(error.message, error.status || HttpStatus.NOT_FOUND);
  }
}


  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async updateBooking(
    @Param('id',ParseIntPipe) id: number,
    @Body() updateBookingDto: UpdateBookingDto
  ) {
    try {
      return await this.bookingsService.updateBooking(id, updateBookingDto);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':bookingId')
  @UsePipes(new ValidationPipe())
  async deleteBooking(@Param('bookingId',ParseIntPipe) bookingId: number): Promise<void> {
    try {
      await this.bookingsService.deleteBooking(bookingId);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

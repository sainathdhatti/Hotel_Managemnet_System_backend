import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { CreateBookingDto } from "./dtos/createBookings.dto";
import { UpdateBookingDto } from "./dtos/updateBookings.dto";
import { UpdateBookingForStaffDto } from "./dtos/updateBookingForStaffs.dto";

@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async createBooking(@Body() createBookingDto: CreateBookingDto) {
    try {
      return await this.bookingsService.createBooking(createBookingDto);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  async getAllBookings() {
    try {
      return await this.bookingsService.getAllBookings();
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(":id")
  @UsePipes(new ValidationPipe())
  async getBookingById(@Param("id", ParseIntPipe) id: number) {
    try {
      return await this.bookingsService.getBookingById(id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.NOT_FOUND
      );
    }
  }

  // @Get("users/:userid")
  // @UsePipes(new ValidationPipe())
  // async getBookingByCustomerId(@Param("userid", ParseIntPipe) userid: number) {
  //   //console.log("hello World");
  //   try {
  //     return await this.bookingsService.getBookingCustomerById(userid);
  //   } catch (error) {
  //     throw new HttpException(
  //       error.message,
  //       error.status || HttpStatus.NOT_FOUND
  //     );
  //   }
  // }

  @Get("users/:userId")
  async getUserByBookingId(@Param("userId") userId: number) {
    return await this.bookingsService.getUserByBookingId(userId);
  }


  @Get("user/:userId/booking/:bookingId")
  async getCheckedInBooking(@Param("userId") userId: number, @Param("bookingId") bookingId: number) {
    return await this.bookingsService.getPresentBookings(userId, bookingId);
  }


@Get('available/:checkInDate/:checkOutDate')
async getAvailableRooms(
  @Param('checkInDate') checkInDate: Date,
  @Param('checkOutDate') checkOutDate: Date
) {
  return this.bookingsService.getAvailableRooms(checkInDate, checkOutDate);
}


  @Patch(":bookingId")
  @UsePipes(new ValidationPipe())
  async updateBooking(
    @Param("bookingId", ParseIntPipe) bookingId: number,
    @Body() updateBookingDto: UpdateBookingForStaffDto
  ) {
    try {
      // Extract the status from the DTO
      const { status } = updateBookingDto;

      // Pass the bookingId and status to the updateBookingStatus method
      if (status) {
        await this.bookingsService.updateBookingStatus(bookingId, status);
      } else {
        throw new BadRequestException("Status is required");
      }
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(":bookingId")
  @UsePipes(new ValidationPipe())
  async deleteBooking(
    @Param("bookingId", ParseIntPipe) bookingId: number
  ): Promise<void> {
    try {
      await this.bookingsService.deleteBooking(bookingId);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

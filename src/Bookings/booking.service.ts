import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './booking.entity';
import { Room, RoomStatus } from 'src/rooms/rooms.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateBookingDto } from './dto/createBookindDto.dto';
import { UpdateBookingDto } from './dto/updateBookingDto.dto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,

    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,

    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createBooking(createBookingDto: CreateBookingDto, file: Express.Multer.File) {
    try {
      // Fetch room and user
      const room = await this.roomsRepository.findOne({ where: { id: createBookingDto.roomId } });
      const user = await this.usersRepository.findOne({ where: { id: createBookingDto.userId } });

      if (!room) {
        throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
      }

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Check room availability
      const existingBooking = await this.bookingsRepository
        .createQueryBuilder('booking')
        .where('booking.room.id = :roomId', { roomId: createBookingDto.roomId })
        .andWhere('booking.checkInDate < :checkOutDate', { checkOutDate: createBookingDto.checkOutDate })
        .andWhere('booking.checkOutDate > :checkInDate', { checkInDate: createBookingDto.checkInDate })
        .getOne();

      if (existingBooking) {
        throw new HttpException('Room is not available for the selected dates', HttpStatus.BAD_REQUEST);
      }

     

      
      const result = await this.cloudinaryService.uploadImage(file);

      const booking = this.bookingsRepository.create({
        room,
        user,
        checkInDate: createBookingDto.checkInDate,
        checkOutDate: createBookingDto.checkOutDate,
        roomNumber: room.roomNumber,
        billPicUrl: result.secure_url,
        status:createBookingDto.status
      });
      room.status = RoomStatus.BOOKED;
      await this.roomsRepository.save(room);
      
      

      return await this.bookingsRepository.save(booking);
    } catch (error) {
      console.error('Error processing booking:', error);
      throw new HttpException('Error processing booking', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllBookings() {
    try {
      return this.bookingsRepository.find({ relations: ['room', 'user'] });
    } catch (error) {
      throw new HttpException('Error retrieving bookings', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getBookingById(id: number) {
    try {
      const booking = await this.bookingsRepository.findOne({
        where: { bookingId: id },
        relations: ['room', 'user'],
      });
      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }
      return booking;
    } catch (error) {
      throw new HttpException('Error retrieving booking', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateBooking(id: number, updateBookingDto: UpdateBookingDto, file?: Express.Multer.File) {
    try {
      const booking = await this.bookingsRepository.findOne({ where: { bookingId: id }, relations: ['room', 'user'] });

      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }

      // Check room availability if dates are updated
      if (updateBookingDto.checkInDate && updateBookingDto.checkOutDate) {
        const existingBooking = await this.bookingsRepository
          .createQueryBuilder('booking')
          .where('booking.room.id = :roomId', { roomId: booking.room.id })
          .andWhere('booking.checkInDate < :checkOutDate', { checkOutDate: updateBookingDto.checkOutDate })
          .andWhere('booking.checkOutDate > :checkInDate', { checkInDate: updateBookingDto.checkInDate })
          .getOne();

        if (existingBooking && existingBooking.bookingId !== id) {
          throw new HttpException('Room is not available for the selected dates', HttpStatus.BAD_REQUEST);
        }
      }

      // Update room if roomId is provided
      if (updateBookingDto.roomId) {
        const newRoom = await this.roomsRepository.findOne({ where: { id: updateBookingDto.roomId } });
        if (!newRoom) {
          throw new HttpException('New room not found', HttpStatus.NOT_FOUND);
        }

        // Check availability of the new room
        const existingBooking = await this.bookingsRepository
          .createQueryBuilder('booking')
          .where('booking.room.id = :roomId', { roomId: updateBookingDto.roomId })
          .andWhere('booking.checkInDate < :checkOutDate', { checkOutDate: updateBookingDto.checkOutDate })
          .andWhere('booking.checkOutDate > :checkInDate', { checkInDate: updateBookingDto.checkInDate })
          .getOne();

        if (existingBooking && existingBooking.bookingId !== id) {
          throw new HttpException('New room is not available for the selected dates', HttpStatus.BAD_REQUEST);
        }

        // Free up the old room
        booking.room.status = RoomStatus.AVAILABLE;
        await this.roomsRepository.save(booking.room);

        // Assign the new room
        booking.room = newRoom;
        booking.room.status = RoomStatus.BOOKED;
        await this.roomsRepository.save(newRoom);
      }

      // Update user if userId is provided
      if (updateBookingDto.userId) {
        const newUser = await this.usersRepository.findOne({ where: { id: updateBookingDto.userId } });
        if (!newUser) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        booking.user = newUser;
      }

      if (updateBookingDto.checkInDate) booking.checkInDate = updateBookingDto.checkInDate;
      if (updateBookingDto.checkOutDate) booking.checkOutDate = updateBookingDto.checkOutDate;

      if (file) {
        const result = await this.cloudinaryService.uploadImage(file);
        booking.billPicUrl = result.secure_url;
      }
       booking.status=updateBookingDto.status
      return this.bookingsRepository.save(booking);
    } catch (error) {
      throw new HttpException('Error updating booking', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteBooking(id: number) {
    try {
      const booking = await this.bookingsRepository.findOne({ where: { bookingId: id }, relations: ['room'] });
      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }

      // Update room status
      const room = booking.room;
      room.status = RoomStatus.AVAILABLE;
      await this.roomsRepository.save(room);

      //booking.status=BookingStatus.CANCELLED

      await this.bookingsRepository.delete(id);
      return { message: 'Booking removed successfully' };
    } catch (error) {
      throw new HttpException('Error removing booking', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

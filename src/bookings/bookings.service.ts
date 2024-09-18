import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking, BookingStatus } from './bookings.Entity';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dtos/createBookings.dto';
import { UserService } from 'src/user/user.service';
import { RoomCategoriesService } from 'src/room-categories/room-categories.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { Room, RoomStatus } from 'src/rooms/rooms.entity';
import { UpdateBookingDto } from './dtos/updateBookings.dto';
import { SpaBookingService } from 'src/spa_booking/spa_booking.service';
// import { FinalBillingService } from 'src/final_billing/final_billing.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private readonly bookingsRepo: Repository<Booking>,
    private readonly userService: UserService,
    private readonly roomcategoryService: RoomCategoriesService,
    private readonly roomService: RoomsService,
    // private readonly spaBookingService: SpaBookingService
    // private readonly finalBillingService: FinalBillingService
  ) {}

  async getAllBookings() {
    return this.bookingsRepo.find({ relations: ['user', 'roomcategory', 'spabookings', 'foodOrders'] });
  }

  async getBookingById(id: number) {
    return await this.bookingsRepo.findOne({
      where: { bookingId: id },
      relations: ['user', 'roomcategory']
    });
  }

  async getBookingCustomerById(customerId: number) {
    const user = await this.userService.getUser(customerId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const bookings = await this.bookingsRepo.find({
      where: { user: user },
      relations: ['user', 'roomcategory', 'foodOrders']
    });
    return bookings;
  }

  private async filterAvailableRooms(rooms: Room[], checkInDate: Date, checkOutDate: Date): Promise<Room[]> {
    const availableRooms = [];

    for (const room of rooms) {
      const isAvailable = await this.isRoomAvailable(room.id, checkInDate, checkOutDate);
      if (isAvailable) {
        availableRooms.push(room);
      }
    }

    return availableRooms;
  }

  private async isRoomAvailable(roomId: number, checkInDate: Date, checkOutDate: Date): Promise<boolean> {
    const conflictingBookings = await this.bookingsRepo.createQueryBuilder('booking')
      .where('booking.room.id = :roomId', { roomId })
      .andWhere('booking.checkInDate < :checkOutDate', { checkOutDate })
      .andWhere('booking.checkOutDate > :checkInDate', { checkInDate })
      .getMany();

    return conflictingBookings.length === 0;
  }

  async createBooking(createBooking: CreateBookingDto) {
    const { userId, categoryId, checkInDate, checkOutDate, noOfAdults, noOfChildrens } = createBooking;
    
    const findUser = await this.userService.getUser(userId);
    const findCategory = await this.roomcategoryService.findOneRoomCategory(categoryId);
  
    if (!findUser || !findCategory) {
      throw new NotFoundException('User or category not found');
    }
  
    const now = new Date();
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
  
    if (checkIn < now) {
      throw new BadRequestException('Check-in date must be greater than or equal to the current date');
    }
  
    if (checkOut <= checkIn) {
      throw new BadRequestException('Check-out date must be after the check-in date');
    }
  
    const overlappingBooking = await this.bookingsRepo.createQueryBuilder('booking')
      .where('booking.user.id = :userId', { userId })
      .andWhere('booking.checkInDate < :checkOutDate', { checkOutDate })
      .andWhere('booking.checkOutDate > :checkInDate', { checkInDate })
      .getOne();
  
    if (overlappingBooking) {
      throw new ConflictException('User already has a booking for the selected dates');
    }

    const rooms = await this.roomService.findAllRoomsByCategory(categoryId);
    const availableRooms = await this.filterAvailableRooms(rooms, checkIn, checkOut);
  
    if (availableRooms.length === 0) {
      throw new ConflictException('No available rooms for the selected dates');
    }
  
    const roomToBook = availableRooms[0];
    const numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = findCategory.price * numberOfNights;
    const advancePayment = totalPrice * 0.40;

    const booking = new Booking();
    booking.noOfAdults = noOfAdults;
    booking.noOfChildrens = noOfChildrens;
    booking.user = findUser;
    booking.room = roomToBook;
    booking.roomcategory = findCategory;
    booking.checkInDate = checkInDate;
    booking.checkOutDate = checkOutDate;
    booking.status = BookingStatus.BOOKED;
    booking.noOfDays = numberOfNights;
    booking.TotalAmount = totalPrice;
    booking.advancePayment = advancePayment;
    booking.room.status = RoomStatus.BOOKED;

    const savedBooking = await this.bookingsRepo.save(booking);
    // await this.finalBillingService.calculateRoomBookingAmount(savedBooking.bookingId);
    return savedBooking;
  }

  async updateBookingStatus(bookingId: number, status: BookingStatus) {
    const booking = await this.bookingsRepo.findOne({
      where: { bookingId },
      relations: ['room', 'roomcategory', 'user'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    booking.status = status;
    return this.bookingsRepo.save(booking);
  }

  async deleteBooking(bookingId: number) {
    const booking = await this.bookingsRepo.findOne({
      where: { bookingId },
      relations: ['room', 'roomcategory', 'user'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Get current date and time
    const now = new Date(); 

    // Calculate the time difference between now and the booking check-in date
    const checkInDate = new Date(booking.checkInDate);
    const timeDifference = checkInDate.getTime() - now.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    if (hoursDifference <= 48) {
      throw new BadRequestException('You can only cancel the booking more than 48 hours before the check-in time');
    }

    // Update the booking status to canceled or delete the booking
    booking.status = BookingStatus.CANCELLED;
    await this.bookingsRepo.save(booking);

    // Optionally, update the room status to available if needed
    booking.room.status = RoomStatus.AVAILABLE;
    return booking;
  }

  async getBookingIdOfBookedStatus(userId: number): Promise<number[]> {
    // Query the repository to find bookings with the status 'CHECK_IN' for the given userId
    const bookings = await this.bookingsRepo
      .createQueryBuilder('booking')
      .select('booking.bookingId') // Select only the booking ID
      .where('booking.userId = :userId', { userId })
      .andWhere('booking.status = :status', { status: 'CHECKED_IN' })
      .getMany(); // Use getMany to return an array of results
  
    // Extract booking IDs from the query result
    const bookingIds = bookings.map(booking => booking.bookingId);
  
    return bookingIds;
  }
  async getSpaBookingsOfBookedStatus(userId: number) {
    const bookings = await this.bookingsRepo
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.room', 'room')
      .leftJoinAndSelect('booking.roomcategory', 'roomcategory')
      .leftJoinAndSelect('booking.spabookings', 'spabookings')
      .leftJoinAndSelect('spabookings.spaservice', 'spaservice')
      .leftJoinAndSelect('booking.foodOrders', 'foodOrders')
      .where('user.id = :userId', { userId })
      .andWhere('booking.status = :status', { status: BookingStatus.CHECKED_IN })
      .getMany();
  
    return bookings;
  }
}

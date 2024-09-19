
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Booking, BookingStatus } from "./bookings.Entity";
import { Repository } from "typeorm";
import { CreateBookingDto } from "./dtos/createBookings.dto";
import { UserService } from "src/user/user.service";
import { RoomCategoriesService } from "src/room-categories/room-categories.service";
import { RoomsService } from "src/rooms/rooms.service";
import { Room, RoomStatus } from "src/rooms/rooms.entity";


@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepo: Repository<Booking>,
    private readonly userService: UserService,
    private readonly roomcategoryService: RoomCategoriesService,
    private readonly roomService: RoomsService,

    

    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>

  ) {}

  async getAllBookings() {
    return this.bookingsRepo.find({
      relations: ["user", "roomcategory", "spabookings", "foodOrders"],
    });
  }

  async getBookingById(id: number) {
    return await this.bookingsRepo.findOne({
      where: { bookingId: id },
      relations: ["user", "roomcategory", "spabookings", "foodOrders"],
    });
  }

  async getBookingCustomerById(customerId: number) {
    const user = await this.userService.getUser(customerId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const bookings = await this.bookingsRepo.find({
      where: { user: user },
      relations: ["user", "roomcategory", "foodOrders"],
    });
    return bookings;
  }

  private async filterAvailableRooms(
    rooms: Room[],
    checkInDate: Date,
    checkOutDate: Date
  ): Promise<Room[]> {
    const availableRooms = [];

    for (const room of rooms) {
      const isAvailable = await this.isRoomAvailable(
        room.id,
        checkInDate,
        checkOutDate
      );
      if (isAvailable) {
        availableRooms.push(room);
      }
    }

    return availableRooms;
  }

  private async isRoomAvailable(
    roomId: number,
    checkInDate: Date,
    checkOutDate: Date
  ): Promise<boolean> {
    const conflictingBookings = await this.bookingsRepo
      .createQueryBuilder("booking")
      .where("booking.room.id = :roomId", { roomId })
      .andWhere("booking.checkInDate < :checkOutDate", { checkOutDate })
      .andWhere("booking.checkOutDate > :checkInDate", { checkInDate })
      .getMany();

    return conflictingBookings.length === 0;
  }

  async createBooking(createBooking: CreateBookingDto) {
    const {
      userId,
      categoryId,
      checkInDate,
      checkOutDate,
      noOfAdults,
      noOfChildrens,
    } = createBooking;

    const findUser = await this.userService.getUser(userId);
    const findCategory = await this.roomcategoryService.findOneRoomCategory(
      categoryId
    );

    if (!findUser || !findCategory) {
      throw new NotFoundException("User or category not found");
    }

    const now = new Date();
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn <= now) {
      throw new BadRequestException(
        "Check-in date must be greater than or equal to the current date"
      );
    }

    if (checkOut <= checkIn) {
      throw new BadRequestException(
        "Check-out date must be after the check-in date"
      );
    }

    const overlappingBooking = await this.bookingsRepo
      .createQueryBuilder("booking")
      .where("booking.user.id = :userId", { userId })
      .andWhere("booking.checkInDate < :checkOutDate", { checkOutDate })
      .andWhere("booking.checkOutDate > :checkInDate", { checkInDate })
      .getOne();

    if (overlappingBooking) {
      throw new ConflictException(
        "User already has a booking for the selected dates"
      );
    }

    const category = await this.roomService.findAllRoomsByCategory(categoryId);
    const availableRooms = await this.filterAvailableRooms(
      category,
      checkIn,
      checkOut
    );

    if (availableRooms.length === 0) {
      throw new ConflictException("No available rooms for the selected dates");
    }

    const roomToBook = availableRooms[0];
    const numberOfNights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = findCategory.price * numberOfNights;
    const advancePayment = totalPrice * 0.4;

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
      relations: ["room", "roomcategory", "user"],
    });

    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    booking.status = status;
    return this.bookingsRepo.save(booking);
  }

  async deleteBooking(bookingId: number) {
    const booking = await this.bookingsRepo.findOne({
      where: { bookingId },
      relations: ["room", "roomcategory", "user"],
    });

    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    // Get current date and time
    const now = new Date();

    // Calculate the time difference between now and the booking check-in date
    const checkInDate = new Date(booking.checkInDate);
    const timeDifference = checkInDate.getTime() - now.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    if (hoursDifference <= 48) {
      throw new BadRequestException(
        "You can only cancel the booking more than 48 hours before the check-in time"
      );
    }

    // Update the booking status to canceled or delete the booking
    booking.status = BookingStatus.CANCELLED;
    await this.bookingsRepo.save(booking);

    // Optionally, update the room status to available if needed
    booking.room.status = RoomStatus.AVAILABLE;
    return booking;
  }

 

  async getPresentBookings(userId: number, bookingId: number) {
    const bill = await this.bookingsRepo.findOne({
      where: { user: { id: userId }, bookingId: bookingId },
      relations: [
        "user",
        "roomcategory",
        "spabookings",
        "foodOrders",
        "spabookings.spaservice",
      ],
    });
    return bill;
  }

  // async getAvailableRooms(checkInDate: Date, checkOutDate: Date){
  //   if (checkInDate >= checkOutDate) {
  //     throw new BadRequestException('Check-out date must be after check-in date');
  //   }
  //   const query = `
  //     SELECT r.*
  //     FROM rooms r
  //     LEFT JOIN bookings b ON r.id = b.roomId
  //     AND b.checkInDate < ?
  //     AND b.checkOutDate > ?
  //     WHERE b.bookingId IS NULL;
  //   `;

  //   // Use the query method from TypeORM's entity manager
  //   const rooms = await this.bookingsRepo.query(query, [checkOutDate, checkInDate]);

    async getAvailableRooms(checkInDate: Date, checkOutDate: Date): Promise<any[]> {
      // Validate the input dates
      if (checkInDate >= checkOutDate) {
          throw new BadRequestException('Check-out date must be after check-in date');
      }

      const availableRooms = await this.roomRepo.query(`
          SELECT r.id AS roomId,
                 r.roomNumber,
                 rc.name AS roomCategory,
                 rc.noOfAdults,
                 rc.noOfChildren,
                 rc.price,
                 CASE
                     WHEN b.bookingId IS NOT NULL THEN 'BOOKED'
                     ELSE 'AVAILABLE'
                 END AS bookingStatus
          FROM rooms r
          JOIN roomcategories rc ON r.roomCategoryId = rc.id
          LEFT JOIN bookings b ON b.roomId = r.id
          AND b.checkInDate < ?
          AND b.checkOutDate > ?
          WHERE b.bookingId IS NULL
      `, [checkOutDate, checkInDate]);

      return availableRooms; // Adjust the return format as needed
  }

}

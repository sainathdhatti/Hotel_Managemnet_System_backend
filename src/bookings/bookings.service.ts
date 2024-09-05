import { BadRequestException, ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking, BookingStatus } from './bookings.Entity';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dtos/createBookings.dto';
import { UserService } from 'src/user/user.service';
import { RoomCategoriesService } from 'src/room-categories/room-categories.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { Room, RoomStatus} from 'src/rooms/rooms.entity';
import { UpdateBookingDto } from './dtos/updateBookings.dto';

@Injectable()
export class BookingsService {
    constructor(@InjectRepository(Booking) private readonly bookingsRepo:Repository<Booking>,
                private readonly userService:UserService,
                private readonly roomcategoryService:RoomCategoriesService  , 
                private readonly roomService:RoomsService,
                // @InjectRepository(RoomCategories) private readonly roomcategoryRepo:Repository<RoomCategories>         
){}

    async getAllBookings() {
          return this.bookingsRepo.find({ relations: ['user', 'roomcategory'] });
    }

    async getBookingById(id:number){
        return await this.bookingsRepo.findOne({
            where:{bookingId:id},
            relations:['user','roomcategory']
        })
    }

    async getBookingCustomerById(customerId: number) {
        // Fetch the user by ID
        const user = await this.userService.getUser(customerId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        // Fetch all bookings for the specific user
        const bookings = await this.bookingsRepo.find({
            where: { user: user },
            relations: ['user','roomcategory']
        });
        return bookings;
    }
    
    async createBooking(createBooking:CreateBookingDto){
        const{userId,categoryId,checkInDate,checkOutDate}=createBooking
        const finduser=await this.userService.getUser(userId)
        const findcategory=await this.roomcategoryService.findOneRoomCategory(categoryId)
        if(!finduser || !findcategory){
            throw new NotFoundException('user or category not found')
        }

        // Validate check-in and check-out dates
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

        const rooms = await this.roomService.findAllRoomsByCategory(categoryId) 
        console.log(rooms)

        const availableRooms = await this.filterAvailableRooms(rooms, checkInDate, checkOutDate);
        console.log(availableRooms)

    if (availableRooms.length === 0) {
      throw new ConflictException('No available rooms for the selected dates');
    }

    // Example: Booking the first available room (you can choose based on your logic)
    const roomToBook = availableRooms[0];
    const numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = findcategory.price * numberOfNights;

    // Create and save the booking
    const booking = new Booking();
    booking.user = finduser;
    booking.room = roomToBook;
    booking.roomcategory=findcategory
    booking.checkInDate = checkInDate;
    booking.checkOutDate = checkOutDate;
    booking.status=BookingStatus.BOOKED
    booking.noOfDays=numberOfNights
    booking.TotalAmount=totalPrice
    findcategory.room.status=RoomStatus.BOOKED

    return this.bookingsRepo.save(booking);
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


  async updateBooking(id: number, updateBooking: UpdateBookingDto) {
    // Fetch the existing booking
    const findBooking = await this.bookingsRepo.findOne({
        where: { bookingId: id },
        relations: ['room']
    });

    if (!findBooking) {
        throw new NotFoundException('No booking exists');
    }

    const { categoryId, checkInDate, checkOutDate } = updateBooking;

    // Fetch room category and all rooms of the category
    const findCategory = await this.roomcategoryService.findOneRoomCategory(categoryId);
    const rooms = await this.roomService.findAllRoomsByCategory(categoryId);

    if (!findCategory) {
        throw new NotFoundException('Room category not found');
    }

    // Function to check availability for the given dates
    const checkRoomAvailability = async (newCheckInDate: Date, newCheckOutDate: Date) => {
        const availableRooms = await this.filterAvailableRooms(rooms, newCheckInDate, newCheckOutDate);
        return availableRooms;
    };

    let availableRooms = [];

    if (categoryId || checkInDate || checkOutDate) {
        // Check availability only if categoryId or dates are provided
        if (categoryId) {
            availableRooms = await checkRoomAvailability(findBooking.checkInDate, findBooking.checkOutDate);
        }

        if (checkInDate && checkOutDate) {
            availableRooms = await checkRoomAvailability(new Date(checkInDate), new Date(checkOutDate));
        }

        if (availableRooms.length === 0) {
            throw new ConflictException('No available rooms for the selected dates');
        }
    }
    findBooking.status=BookingStatus.AVAILABLE;
    findCategory.room.status=RoomStatus.AVAILABLE;

    // Update the booking with the new details
    findBooking.checkInDate = checkInDate ? new Date(checkInDate) : findBooking.checkInDate;
    findBooking.checkOutDate = checkOutDate ? new Date(checkOutDate) : findBooking.checkOutDate;
    findBooking.room = availableRooms[0]; // Example: Assigning the first available room
    findBooking.status=BookingStatus.BOOKED
    findBooking.room.status=RoomStatus.BOOKED
    // Save the updated booking
    const updatedBooking = await this.bookingsRepo.save(findBooking);

    // Return the updated booking with all related entities
    return this.bookingsRepo.findOne({
        where: { bookingId: updatedBooking.bookingId },
        relations: ['room', 'roomCategory', 'user'] // Ensure relations are included in the final result
    });
}

async deleteBooking(bookingId:number){
    const booking = await this.bookingsRepo.findOne({
        where: { bookingId },
        relations: ['room', 'roomcategory','user'],
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
        throw new BadRequestException('You can only cancel the booking before 48 hours of check-in time');
      }
  
      // Update the booking status to canceled or delete the booking
      booking.status = BookingStatus.CANCELLED;
      await this.bookingsRepo.save(booking);
  
      // Optionally, update the room status to available if needed
      booking.room.status=RoomStatus.AVAILABLE
      return booking
    }
}


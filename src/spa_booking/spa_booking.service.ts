import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SpaBooking } from "./spa_bookingEntity";
import { Repository } from "typeorm";
import { CreateSpaBookingDto } from "./dtos/createspa_booking.dto";
import { UserService } from "src/user/user.service";
import { SpaServiceService } from "src/spa_service/spa_service.service";
import { TimeSlotService } from "src/time_slot/time_slot.service";
import { StaffMembersService } from "src/staff_members/staff_members.service";
import { StaffMembers } from "src/staff_members/staff_membersEntity";
import { updateSpaBookingDto } from "./dtos/updatespa_booking.dto";
import { updateSpaBookingBySpaDto } from "./dtos/updatespa_bookingByStaff.dto";

@Injectable()
export class SpaBookingService {
  constructor(
    @InjectRepository(SpaBooking)
    private readonly spabookingRepo: Repository<SpaBooking>,
    private readonly userService: UserService,
    private spaserviceService: SpaServiceService,
    private timeslotService: TimeSlotService,
    private staffmemberService: StaffMembersService
  ) // private staffmemberRepo:Repository<StaffMembers>
  {}


  async getAllSpaBookings() {
    const bookings = await this.spabookingRepo.find({
      relations: [
        "user",
        "spaservice",
        "timeslot",
        "staffmember",
      ],
    });
    return bookings;
  }

  async getSpaBookingsById(id: number) {
    const bookings = await this.spabookingRepo.findOne({
      where: { id },
      relations: [
        "user",
        "spaservice",
        "timeslot",
        "staffmember",
      ],
    });
    return bookings;
  }

  async getBookingsByCustomerId(userId: number) {
    return await this.spabookingRepo.find({
      where: {
        user: { id: userId }, // Filter by customer ID
      },
      relations: [
        "user",
        "spaservice",
        "timeslot",
        "staffmember",
      ],
    });
  }


  async createSpaBooking(createBooking: CreateSpaBookingDto) {
    const {
      firstName,
      lastName,
      gender,
      userId,
      spaserviceId,
      timeslotId,
      booking_date,
      status,
    } = createBooking;
  
    // Fetch related entities
    const user = await this.userService.getUser(userId);
    const spaService = await this.spaserviceService.getAllSpaServiceById(spaserviceId);
    const timeSlot = await this.timeslotService.findTimeSlotById(timeslotId);
  
    if (!user || !spaService || !timeSlot) {
      throw new NotFoundException("One or more related entities not found");
    }
  
    // Fetch all staff members based on category
    const allStaff = await this.staffmemberService.getStaffMemberByCategory('Spa');
  
    // Filter staff based on gender and availability
    const availableStaff = await Promise.all(
      allStaff.filter(staff => staff.gender === gender).map(async (staff) => {
        const isBooked = await this.spabookingRepo.findOne({
          where: {
            staffmember: staff,
            booking_date: booking_date,
            timeslot: timeSlot,
          },
        });
        return isBooked ? null : staff;
      })
    );
  
    // Remove null values
    const availableStaffMembers = availableStaff.filter(staff => staff !== null);
  
    if (availableStaffMembers.length === 0) {
      throw new ConflictException("No available staff member for the given date and time slot");
    }

    const result = await this.spabookingRepo.createQueryBuilder("SpaBooking")
    .select("COUNT(distinct SpaBooking.id)", "bookingCount").getRawOne(); 
    const bookingCount=parseInt(result.bookingCount);
  
  
    // Check if adding the new booking would exceed the limit of 3 bookings
    if (bookingCount >= 3) {
      throw new ConflictException("Cannot book more than 3 spa sessions for this user");
    }
  
    // Choose the first available staff member
    const allocatedStaff = availableStaffMembers[0];
  
    //Create a new SpaBooking instance
    const booking = this.spabookingRepo.create({
      booking_date,
      firstName,
      lastName,
      gender,
      status,
      user,
      spaservice: spaService,
      timeslot: timeSlot,
      staffmember: allocatedStaff,
    });

    return this.spabookingRepo.save(booking);
  }
  

  async updateSpaBookingById(id: number, updateSpaDetails:updateSpaBookingBySpaDto) {
    const booking = await this.spabookingRepo.findOne({
      where: { id },
      relations: ['user', 'spaservice', 'timeslot', 'staffmember'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (updateSpaDetails.status) {
      booking.status = updateSpaDetails.status;
    }

    return this.spabookingRepo.save(booking);
  }

  async deleteSpaBooking(id: number) {
      const booking=await this.spabookingRepo.findOne({
        where:{id},
        relations:['user',"spaservice","timeslot","staffmember",]
      })
      if(!booking){
        throw new NotFoundException('Booking not found');
      }
      const currentTime = new Date();
      const bookingTime = booking.booking_date;
      const oneHourInMillis = 60 * 60 * 1000;
      const timeDifference = bookingTime.getTime() - currentTime.getTime();
  
      if (timeDifference <= oneHourInMillis) {
        throw new ConflictException('You can only cancel bookings more than 1 hour before the scheduled time');
      }
  
      return await this.spabookingRepo.delete(id)
  }
 }

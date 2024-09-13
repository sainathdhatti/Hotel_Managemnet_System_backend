import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SpaBookingStatus, SpaBooking } from "./spa_bookingEntity";
import { Repository } from "typeorm";
import { CreateSpaBookingDto } from "./dtos/createspa_booking.dto";
import { UserService } from "src/user/user.service";
import { SpaServiceService } from "src/spa_service/spa_service.service";
import { TimeSlotService } from "src/time_slot/time_slot.service";
import { StaffMembersService } from "src/staff_members/staff_members.service";
import { updateSpaBookingBySpaDto } from "./dtos/updatespa_bookingByStaff.dto";
import { BookingsService } from "src/bookings/bookings.service";
import { BookingStatus } from "src/bookings/bookings.Entity";

@Injectable()
export class SpaBookingService {
  constructor(
    @InjectRepository(SpaBooking)
    private readonly spabookingRepo: Repository<SpaBooking>,
    private readonly userService: UserService,
    private readonly spaserviceService: SpaServiceService,
    private readonly timeslotService: TimeSlotService,
    private readonly staffmemberService: StaffMembersService,
    private readonly bookingsService: BookingsService
  ) {}

  async getAllSpaBookings() {
    const bookings = await this.spabookingRepo.find({
      relations: ["user", "spaservice", "timeslot", "staffmember","booking"],
    });
    return bookings;
  }

  async getSpaBookingsById(id: number) {
    const bookings = await this.spabookingRepo.findOne({
      where: { id },
      relations: ["user", "spaservice", "timeslot", "staffmember"],
    });
    return bookings;
  }

  async getBookingsByCustomerId(userId: number) {
    return await this.spabookingRepo.find({
      where: {
        user: { id: userId }, // Filter by customer ID
      },
      relations: ["user", "spaservice", "timeslot", "staffmember"],
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
      bookingId
    } = createBooking;

    // Fetch related entities
    const user = await this.userService.getUser(userId);
    const spaService = await this.spaserviceService.getAllSpaServiceById(
      spaserviceId
    );
    const timeSlot = await this.timeslotService.findTimeSlotById(timeslotId);
    const bookings = await this.bookingsService.getBookingById(bookingId);

    if (!user || !spaService || !timeSlot || !bookings) {
      throw new NotFoundException("One or more related entities not found");
    }

    // Fetch all staff members based on category
    const allStaff = await this.staffmemberService.getStaffMemberByCategory(
      "Spa"
    );

    // Filter staff based on gender and availability
    const availableStaff = await Promise.all(
      allStaff
        .filter((staff) => staff.gender === gender)
        .map(async (staff) => {
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
    const availableStaffMembers = availableStaff.filter(
      (staff) => staff !== null
    );

    if (availableStaffMembers.length === 0) {
      throw new ConflictException(
        "No available staff member for the given date and time slot"
      );
    }

    // Get the current date and time
    const currentDateTime = new Date();

    // Check if the selected time slot is in the past
    const slotDateTime = new Date(booking_date); // Assume booking_date is a Date or can be converted to one
    if (slotDateTime <= currentDateTime) {
      throw new BadRequestException(
        "Cannot book a spa service for a past time slot"
      );
    }

    const result = await this.spabookingRepo
      .createQueryBuilder("booking")
      .select("COUNT(DISTINCT booking.id)", "bookingCount")
      .where("booking.userId = :userId", { userId })
      .andWhere("booking.status != :status", {
        status: SpaBookingStatus.CANCELLED,
      })
      .andWhere("booking.status = :status", {
        status: BookingStatus.CHECKED_IN
,      })
      .getRawOne();

    // Parse the result to get the booking count
    const bookingCount = parseInt(result.bookingCount, 10);

    // Log the booking count for debugging
    console.log("Booking Count:", bookingCount);

    // Check if the booking count exceeds the limit
    if (bookingCount >= 3) {
      console.log("Booking count exceeds the limit");
      throw new ConflictException(
        "Cannot book more than 3 spa sessions for this user"
      );
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
      booking: bookings
    });

    return this.spabookingRepo.save(booking);
  }

  async updateSpaBookingById(
    id: number,
    updateSpaDetails: updateSpaBookingBySpaDto
  ) {
    const booking = await this.spabookingRepo.findOne({
      where: { id },
      relations: ["user", "spaservice", "timeslot", "staffmember"],
    });

    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    if (updateSpaDetails.status) {
      booking.status = updateSpaDetails.status;
    }

    return this.spabookingRepo.save(booking);
  }

  async deleteSpaBooking(id: number) {
    const booking = await this.spabookingRepo.findOne({
      where: { id },
      relations: ["user", "spaservice", "timeslot", "staffmember"],
    });
    if (!booking) {
      throw new NotFoundException("Booking not found");
    }
    const currentTime = new Date();
    const bookingTime = booking.booking_date;
    const oneHourInMillis = 60 * 60 * 1000;
    const timeDifference = bookingTime.getTime() - currentTime.getTime();

    if (timeDifference <= oneHourInMillis) {
      throw new ConflictException(
        "You can only cancel bookings more than 1 hour before the scheduled time"
      );
    }
    booking.status = SpaBookingStatus.CANCELLED;
    await this.spabookingRepo.save(booking);
    return await this.spabookingRepo.delete(id);
  }


}

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
import { FamilyMembersService } from "src/family_members/family_members.service";
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
    private familymemberService: FamilyMembersService,
    private spaserviceService: SpaServiceService,
    private timeslotService: TimeSlotService,
    private staffmemberService: StaffMembersService
  ) // private staffmemberRepo:Repository<StaffMembers>
  {}

  async getAllSpaBookings() {
    const bookings = await this.spabookingRepo.find({
      relations: [
        "user",
        "familymember",
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
        "familymember",
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
        "familymember",
        "spaservice",
        "timeslot",
        "staffmember",
      ],
    });
  }

  async getBookingByFamilyMember(userId: number, familymemberId: number) {
    const finduser = await this.spabookingRepo.find({
      where: {
        user: { id: userId },
      },
    });
    let findfamilymember = null;
    if (finduser) {
      findfamilymember = await this.spabookingRepo.find({
        where: { familymember: { id: familymemberId } },
        relations: [
          "user",
          "familymember",
          "spaservice",
          "timeslot",
          "staffmember",
        ],
      });
    }
    return findfamilymember;
  }

  async createSpaBooking(createBooking: CreateSpaBookingDto) {
    const {
      userId,
      familymemberId,
      spaserviceId,
      timeslotId,
      booking_date,
      status,
    } = createBooking;

    // Fetch related entities
    const user = await this.userService.getUser(userId);
    const familyMember = await this.familymemberService.getFamilyMemberById(
      familymemberId
    );
    const spaService = await this.spaserviceService.getAllSpaServiceById(
      spaserviceId
    );
    const timeSlot = await this.timeslotService.findTimeSlotById(timeslotId);

    // Check if all related entities are found
    if (!user || !familyMember || !spaService || !timeSlot) {
      throw new NotFoundException("One or more related entities not found");
    }

    // Fetch all staff members
    const allStaff = await this.staffmemberService.getAllStaffMembers();
    // check the avilability of staff based on gender
    const filteredStaff = allStaff.filter(
      (staff) => staff.gender  === familyMember.gender
    );

    // Filter available staff
    const availableStaff = await Promise.all(
      filteredStaff.map(async (staff) => {
        // Check if the staff member is already booked at the given date and time slot
        const isBooked = await this.spabookingRepo.findOne({
          where: {
            staffmember: staff,
            booking_date: booking_date,
            timeslot: timeSlot,
          },
        });

        // Return staff if not booked
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

    // Choose the first available staff member
    const allocatedStaff = availableStaffMembers[0];

    // Create a new SpaBooking instance
    const booking = this.spabookingRepo.create({
      booking_date,
      status,
      user,
      familymember: familyMember,
      spaservice: spaService,
      timeslot: timeSlot,
      staffmember: allocatedStaff,
    });

    return this.spabookingRepo.save(booking);
  }

  async updateBookingByFamilyMember(
    userId: number,
    familymemberId: number,
    updateSpaDetails: updateSpaBookingDto
  ): Promise<SpaBooking> {
    // Find the booking by user ID
    const spabooking = await this.spabookingRepo.findOne({
      where: {
        user: { id: userId },
        familymember: { id: familymemberId },
      },
      relations: ["familymember", "staffmember", "timeslot"],
    });

    // Check if the booking exists and if it involves the specified family member
    if (!spabooking) {
      throw new NotFoundException("Booking not found");
    }

    // Update booking date if provided
    if (updateSpaDetails.booking_date) {
      const newDate = new Date(updateSpaDetails.booking_date);
      if (isNaN(newDate.getTime())) {
        throw new ConflictException("Invalid date format");
      }

      const allStaff = await this.staffmemberService.getAllStaffMembers();
      const filteredStaff = allStaff.filter(
        (staff) => staff.gender === spabooking.familymember.gender
      );

      // Check availability of filtered staff members
      const availableStaff = await Promise.all(
        filteredStaff.map(async (staff) => {
          const isBooked = await this.spabookingRepo.findOne({
            where: {
              staffmember: staff,
              booking_date: newDate,
              timeslot: spabooking.timeslot,
            },
          });
          return isBooked ? null : staff;
        })
      );

      const availableStaffMembers = availableStaff.filter(
        (staff) => staff !== null
      );

      if (availableStaffMembers.length === 0) {
        throw new ConflictException(
          "No available staff member for the given date and time slot"
        );
      }

      // Allocate available staff member to the family member
      spabooking.staffmember = availableStaffMembers[0];
      spabooking.booking_date = newDate;
    }

    // Update timeslot if provided
    if (updateSpaDetails.timeslotId) {
      const staffMember = spabooking.staffmember;
      const isStaffBooked = await this.spabookingRepo.findOne({
        where: {
          staffmember: staffMember,
          booking_date:
            updateSpaDetails.booking_date || spabooking.booking_date,
          timeslot: updateSpaDetails.timeslotId,
        },
      });

      if (isStaffBooked) {
        throw new ConflictException(
          "Staff member is already booked for the given timeslot"
        );
      }

      // Update timeslot
      spabooking.timeslot = updateSpaDetails.timeslotId;
    }

    // Update spa service if provided
    if (updateSpaDetails.spaserviceId) {
      spabooking.spaservice = updateSpaDetails.spaserviceId;
    }

    // Save the updated booking
    return await this.spabookingRepo.save(spabooking);
  }

  async updateBookingStatus(
    familymemberId: number,
    updateStatus: updateSpaBookingBySpaDto
  ) {
    // Fetch the family member to ensure it exists
    const findFamilyMember = await this.familymemberService.getFamilyMemberById(
      familymemberId
    );

    if (!findFamilyMember) {
      throw new NotFoundException("Family member not found");
    }

    // Find the corresponding booking(s) for this family member
    const bookings = await this.spabookingRepo.find({
      where: { familymember: { id: familymemberId } },
    });

    if (bookings.length === 0) {
      throw new NotFoundException(
        "No bookings found for the given family member"
      );
    }

    // Update all the bookings with the new status
    await Promise.all(
      bookings.map(async (booking) => {
        // Use the update method correctly: condition to find the entity and fields to update
        await this.spabookingRepo.update(booking.id, updateStatus);
      })
    );
  }

  async deleteBooking(userId: number, familymemberId) {
    const booking = await this.spabookingRepo.findOne({
      where: {
        user: { id: userId },
        familymember: { id: familymemberId },
      },
    });

    // Check if the booking exists
    if (!booking) {
      throw new NotFoundException("Booking not found");
    }
    // Check if the cancellation is being made at least 30 minutes before the booking time
    const now = new Date();
    const bookingDate = new Date(booking.booking_date);

    // Calculate the difference in milliseconds
    const timeDifference = bookingDate.getTime() - now.getTime();

    // Convert milliseconds to minutes
    const minutesUntilBooking = timeDifference / (1000 * 60);

    if (minutesUntilBooking < 30) {
      throw new ConflictException(
        "Booking can only be canceled at least 30 minutes before the scheduled time"
      );
    }

    // Delete the booking
    await this.spabookingRepo.remove(booking);
  }
}

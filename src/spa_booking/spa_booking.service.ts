import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpaBooking } from './spa_bookingEntity';
import { Repository } from 'typeorm';
import { CreateSpaBookingDto } from './dtos/createspa_booking.dto';
import { UserService } from 'src/user/user.service';
import { FamilyMembersService } from 'src/family_members/family_members.service';
import { SpaServiceService } from 'src/spa_service/spa_service.service';
import { TimeSlotService } from 'src/time_slot/time_slot.service';
import { StaffMembersService } from 'src/staff_members/staff_members.service';
import { StaffMembers } from 'src/staff_members/staff_membersEntity';

@Injectable()
export class SpaBookingService {
    constructor(@InjectRepository(SpaBooking) private readonly spabookingRepo:Repository<SpaBooking>,
                private readonly userService:UserService,
                private familymemberService:FamilyMembersService,
                private spaserviceService:SpaServiceService,
                private timeslotService:TimeSlotService,
                private staffmemberService:StaffMembersService,  
                // private staffmemberRepo:Repository<StaffMembers>
){}

    async getAllSpaBookings(){
        const bookings=await this.spabookingRepo.find({
            relations:['user','familymember','spaservice','timeslot','staffmember']
        })
        return bookings
    }

    async getSpaBookingsById(id:number){
        const bookings=await this.spabookingRepo.findOne({
            where:{id},
            relations:['user','familymember','spaservice','timeslot','staffmember']
        })
        return bookings
    }

    async getBookingsByCustomerId(userId: number) {
        return await this.spabookingRepo.find({
          where: { user: { id: userId } },
          relations: ['user','familymember','spaservice','timeslot','staffmember'],
        });
      }
      
    async getBookingByFamilyMember(userId:number,familymemberId:number){
        const finduser=await this.spabookingRepo.find({
            where:{user:{id:userId}}
        })
        let findfamilymember=null
        if(finduser){
            findfamilymember=await this.spabookingRepo.find({
                where:{familymember:{id:familymemberId}},
                relations:['user','familymember','spaservice','timeslot','staffmember']
        })
        }
        return findfamilymember
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
        const familyMember = await this.familymemberService.getFamilyMemberById(familymemberId);
        const spaService = await this.spaserviceService.getAllSpaServiceById(spaserviceId);
        const timeSlot = await this.timeslotService.findTimeSlotById(timeslotId);
    
        // Check if all related entities are found
        if (!user || !familyMember || !spaService || !timeSlot) {
          throw new NotFoundException('One or more related entities not found');
        }
    
        // Fetch all staff members
        const allStaff = await this.staffmemberService.getAllStaffMembers();
    
        // Filter available staff
        const availableStaff = await Promise.all(
          allStaff.map(async (staff) => {
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
          }),
        );
    
        // Remove null values
        const availableStaffMembers = availableStaff.filter(staff => staff !== null);
    
        if (availableStaffMembers.length === 0) {
          throw new ConflictException('No available staff member for the given date and time slot');
        }
    
        // Optionally, you can choose a staff member based on specific criteria or randomly
        const allocatedStaff = availableStaffMembers[0]; // Choose the first available staff member
    
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
        
}

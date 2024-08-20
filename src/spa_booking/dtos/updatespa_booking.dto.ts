import { IsDate, isNotEmpty, IsNotEmpty, IsOptional } from "class-validator";
import { FamilyMembers } from "src/family_members/family_membersEntity";
import { SpaService } from "src/spa_service/spa_service.Entity";
import { StaffMembers } from "src/staff_members/staff_membersEntity";
import { TimeSlot } from "src/time_slot/time_slot.Entity";
import { UserEntity } from "src/user/user.entity";

export class updateSpaBookingDto{
    @IsOptional()
    @IsDate()
    booking_date:Date

    @IsOptional()
    status:string
    
    @IsOptional()
    userId=UserEntity
    
    @IsOptional()
    familymemberId:FamilyMembers

    @IsOptional()
    spaserviceId:SpaService

    @IsOptional()
    timeslotId:TimeSlot

    @IsNotEmpty()
    staffmemberId=StaffMembers
}
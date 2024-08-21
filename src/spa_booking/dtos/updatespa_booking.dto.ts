import { IsDate, IsOptional } from "class-validator";
import { SpaService } from "src/spa_service/spa_service.Entity";
import { TimeSlot } from "src/time_slot/time_slot.Entity";

export class updateSpaBookingDto{    
    @IsOptional()
    @IsDate()
    booking_date: Date; 

    @IsOptional()
    spaserviceId:SpaService

    @IsOptional()
    timeslotId:TimeSlot

}
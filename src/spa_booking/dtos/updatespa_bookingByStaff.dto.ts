import { IsEnum, IsOptional } from "class-validator";
import { BookingStatus } from "../spa_bookingEntity";

export class updateSpaBookingBySpaDto{    
    @IsEnum(BookingStatus)
    @IsOptional()
    status:BookingStatus
}
import { IsEnum, IsOptional } from "class-validator";
import { SpaBookingStatus } from "../spa_bookingEntity";

export class updateSpaBookingBySpaDto{    
    @IsEnum(SpaBookingStatus)
    @IsOptional()
    status:SpaBookingStatus
}
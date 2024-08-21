import { IsOptional } from "class-validator";

export class updateSpaBookingBySpaDto{    
    @IsOptional()
    status:string

}
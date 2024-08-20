import { IsDate, IsNotEmpty, IsNumber } from 'class-validator'; // Fixed imports

export class CreateSpaBookingDto {
    @IsNotEmpty()
    @IsDate()
    booking_date: Date; 

    status: string; 

    @IsNotEmpty()
    @IsNumber()
    userId: number; 

    @IsNotEmpty()
    @IsNumber()
    familymemberId: number; 

    @IsNotEmpty()
    @IsNumber()
    spaserviceId: number; 

    @IsNotEmpty()
    @IsNumber()
    timeslotId: number; 

    @IsNumber()
    staffmemberId: number; 
}

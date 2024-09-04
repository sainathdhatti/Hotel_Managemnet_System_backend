import { IsDate, IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional } from 'class-validator'; 
import {Gender, BookingStatus } from '../spa_bookingEntity';

export class CreateSpaBookingDto {
    @IsNotEmpty()
    @IsDate()
    booking_date: Date; 

    @IsNotEmpty()
    @IsString()
    firstName:string

    @IsNotEmpty()
    @IsString()
    lastName:string

    @IsEnum(Gender)
    @IsNotEmpty()
    gender: Gender;

    @IsEnum(BookingStatus)
    @IsOptional()
    status?: BookingStatus; 

    @IsNotEmpty()
    @IsNumber()
    userId: number; 

    @IsNotEmpty()
    @IsNumber()
    spaserviceId: number; 

    @IsNotEmpty()
    @IsNumber()
    timeslotId: number; 

}

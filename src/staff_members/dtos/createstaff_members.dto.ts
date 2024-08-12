import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { StaffStatus } from '../staff_status';
import { StaffGender } from '../staff_gender';

export class CreatestaffmembersDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsString()
    @Matches(/^\d{10}$/, { message: 'Phone number must be exactly 10 digits' })
    phoneNumber: string;

    @IsString()
    status: string="available";

    @IsString()
    @IsNotEmpty()
    gender:string;

    staffcategoryId: number;
}

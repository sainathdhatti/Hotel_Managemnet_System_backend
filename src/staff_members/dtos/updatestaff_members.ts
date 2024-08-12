import { IsEmail, isNotEmpty, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";
import { StaffStatus } from "../staff_status";
import { StaffGender } from "../staff_gender";

export class UpdatestaffmembersDto{
    @IsOptional()
    firstName:string

    @IsOptional()
    lastName:string

    @IsOptional()
    email:string

    @IsOptional()
    password:string

    @IsOptional()
    phoneNumber: string;

    @IsOptional()
    status: string="available";

    @IsOptional()
    gender:string;

    @IsOptional()
    staffcategoryId:number
}
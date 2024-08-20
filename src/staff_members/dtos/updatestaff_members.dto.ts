import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from "class-validator";
import { StaffCategory } from "src/staff_category/staff_categoryEntity";

export class updateStaffMembersDto{
    @IsOptional()
    @IsString()
    @Length(3,10)
    firstName:string

    @IsOptional()
    @IsString()
    @Length(3,10)
    lastName:string

    @IsOptional()
    @Matches(/^\d+$/, { message: 'Phone number must contain only digits' })
    phone: string;

    @IsOptional()
    @IsString()
    gender:string

    @IsOptional()
    @IsEmail()
    email:string

    @IsOptional()
    @IsString()
    @Length(6,10)
    password:string

    @IsOptional()
    staffcategory:number

}
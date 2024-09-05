import { IsEmail, IsNotEmpty, isString, IsString, Length, Matches } from "class-validator";
import { StaffCategory } from "src/staff_category/staff_categoryEntity";

export class createStaffMembersDto{
    @IsNotEmpty()
    @IsString()
    @Length(3,10)
    firstName:string

    @IsNotEmpty()
    @IsString()
    @Length(3,10)
    lastName:string

    @IsNotEmpty()
    @Matches(/^\d+$/, { message: 'Phone number must contain only digits' })
    phone: string;

    @IsNotEmpty()
    @IsString()
    gender:string

    @IsNotEmpty()
    @IsEmail()
    email:string

    @IsNotEmpty()
    @IsString()
    @Length(6,10)
    password:string

    @IsNotEmpty()
    staffcategory:number

}
import { IsString, IsEmail, IsPhoneNumber, Length, Matches, IsNotEmpty } from 'class-validator';

export class CreateAdminDto {
    @IsString()
    @Length(1, 255)
    @IsNotEmpty() 
    firstName: string;

    @IsString()
    @Length(1, 255)
    @IsNotEmpty() 
    lastName: string;

    @IsEmail()
    @Length(1, 255)
    @IsNotEmpty() 
    email: string;

    @Matches(/^\d{10}$/, { message: 'Phone number must be exactly 10 digits' }) 
    @IsNotEmpty()
    phone: string;

    @IsString()
    @Length(6, 255)
    @IsNotEmpty() 
    password: string;
}

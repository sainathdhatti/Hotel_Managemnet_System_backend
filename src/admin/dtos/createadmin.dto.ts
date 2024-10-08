import { IsString, IsEmail , Length, Matches, IsNotEmpty } from 'class-validator';

export class CreateAdminDto {
    @IsString()
    @Length(3, 255)
    @IsNotEmpty() 
    firstName: string;

    @IsString()
    @Length(3, 255)
    @IsNotEmpty() 
    lastName: string;

    @IsEmail()
    @IsNotEmpty() 
    email: string;
 
    @IsNotEmpty()
    @Length(10, 10, { message: 'Phone number must be exactly 10 digits long' })
    @Matches(/^\d+$/, { message: 'Phone number must contain only digits' })
    phone: string;

    @IsString()
    @Length(6, 15)
    @IsNotEmpty() 
    password: string;
}

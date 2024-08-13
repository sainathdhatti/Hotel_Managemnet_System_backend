import { IsString, IsEmail, IsPhoneNumber, IsOptional, Length } from 'class-validator';

export class UpdateAdminDto {
    @IsString()
    @IsOptional()
    @Length(1, 255)
    firstName?: string;

    @IsString()
    @Length(1, 255) 
    @IsOptional()
    lastName: string;

    @IsEmail()
    @IsOptional()
    @Length(1, 255) 
    email?: string;

    @IsPhoneNumber() 
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    @Length(6, 255) 
    password?: string;
}

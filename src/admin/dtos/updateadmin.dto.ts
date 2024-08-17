import { IsString, IsEmail, Matches, IsOptional, Length } from 'class-validator';

export class UpdateAdminDto {
    @IsString()
    @IsOptional()
    @Length(3, 255)
    firstName?: string;

    @IsString()
    @Length(3, 255) 
    @IsOptional()
    lastName: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsOptional()
    @IsString()
    @Matches(/^\d+$/, { message: 'Phone number must contain only digits' })
    phone: string;

    @IsString()
    @IsOptional()
    @Length(6, 15) 
    password: string;
}

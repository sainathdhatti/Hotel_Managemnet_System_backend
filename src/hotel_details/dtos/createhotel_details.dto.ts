import { isNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from "class-validator"

export class createHotel_DetailsDto{
    @IsNotEmpty()
    @IsString()
    name:string

    @IsNotEmpty()
    @IsString()
    description:string

    @IsNotEmpty()
    @IsString()
    address:string
    
    @IsNotEmpty()
    @IsString()
    Phone:string

    @IsNotEmpty()
    @IsString()
    Email:string

    @IsNotEmpty()
    @IsUrl()
    facebookLink:string

    @IsNotEmpty()
    @IsUrl()
    instagramLink:string

    @IsNotEmpty()
    @IsUrl()
    twitterLink:string
}
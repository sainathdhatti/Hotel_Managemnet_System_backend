import { isNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from "class-validator"

export class updateHotel_DetailsDto{
    @IsOptional()
    @IsString()
    name:string

    @IsOptional()
    @IsString()
    description:string

    @IsOptional()
    @IsString()
    address:string
    
    @IsOptional()
    @IsString()
    Phone:string

    @IsOptional()
    @IsString()
    Email:string

    @IsOptional()
    @IsUrl()
    facebookLink:string

    @IsOptional()
    @IsUrl()
    instagramLink:string

    @IsOptional()
    @IsUrl()
    twitterLink:string
}
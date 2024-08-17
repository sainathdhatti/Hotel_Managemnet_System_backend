import { IsNotEmpty, IsString } from "class-validator";

export class createContact_Us_Dto{
    @IsNotEmpty()
    @IsString()
    firstName:string

    @IsNotEmpty()
    @IsString()
    lastName:string

    @IsNotEmpty()
    @IsString()
    Email:string

    @IsNotEmpty()
    @IsString()
    Subject:string

    @IsNotEmpty()
    @IsString()
    Message:string
}
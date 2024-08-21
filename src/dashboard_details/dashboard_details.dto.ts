import { IsNotEmpty, IsNumber, IsString,isNotEmpty } from "class-validator";

export class createDashboard_DetailsDto{
    @IsNotEmpty()
    @IsString()
    name:string

    @IsNumber()
    count:number
}
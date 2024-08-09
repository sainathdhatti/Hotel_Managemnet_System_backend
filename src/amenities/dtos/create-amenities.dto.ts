import { IsNotEmpty, IsString, Length } from "class-validator";


export class CreateAmenitiesDto{
    @IsString()
    @IsNotEmpty()
    @Length(3,255)
    name:string

}
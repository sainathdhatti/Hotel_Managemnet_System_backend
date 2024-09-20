import { IsNotEmpty, IsString } from "class-validator";

export class CreateReceptionistAuthDto{
    @IsString()
    @IsNotEmpty()
    email:string;

    @IsString()
    @IsNotEmpty()
    password:string;
}
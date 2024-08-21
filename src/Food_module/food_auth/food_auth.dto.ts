import { IsNotEmpty, IsString } from "class-validator";

export class CreateFoodAuthDto{
    @IsString()
    @IsNotEmpty()
    email:string;

    @IsString()
    @IsNotEmpty()
    password:string;
}
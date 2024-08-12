import { IsNotEmpty, IsString } from "class-validator";

export class CreateSpaAuthDto{
    @IsString()
    @IsNotEmpty()
    email:string;

    @IsString()
    @IsNotEmpty()
    password:string;
}
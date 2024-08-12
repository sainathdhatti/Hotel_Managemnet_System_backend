import { IsNotEmpty, IsString, Length } from "class-validator";



export class CreateSuperAdminDto{
    @IsString()
    @IsNotEmpty()
    @Length(3,255)
    name:string
    
    @IsNotEmpty()
    @IsString()
    @Length(5,1024)
    email:string

    @IsNotEmpty()
    @IsString()
    @Length(8,32)
    password:string

    @IsNotEmpty()
    @IsString()
    @Length(10)
    phone:string

}
import { IsNotEmpty, IsString } from "class-validator";
import { UserEntity } from "src/user/user.entity";
import { } from "typeorm";

export class createFamily_MemberDto{

    @IsString()
    @IsNotEmpty()
    firstName:string

    @IsString()
    @IsNotEmpty()
    lastName:string

    @IsString()
    @IsNotEmpty()
    gender:string

}
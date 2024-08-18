import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserEntity } from "src/user/user.entity";
import { } from "typeorm";

export class updateFamily_MemberDto{

    @IsString()
    @IsOptional()
    firstName:string

    @IsString()
    @IsOptional()
    lastName:string

    @IsString()
    @IsOptional()
    gender:string

    @IsOptional()
    user:UserEntity
}
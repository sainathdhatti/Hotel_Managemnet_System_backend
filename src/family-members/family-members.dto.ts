import { IsNotEmpty, IsString } from "class-validator";

export class CreateFamilyMembersDto{
    @IsNotEmpty()
    @IsString()
    name:string

    @IsNotEmpty()
    @IsString()
    genderPreference:string

}
import { IsNotEmpty, IsString } from "class-validator";

export class createStaffCategoryDto{
    @IsNotEmpty()
    @IsString()
    category:string
}
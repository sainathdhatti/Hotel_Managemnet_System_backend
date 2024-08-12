import { IsNotEmpty, IsString } from "class-validator";

export class CreatestaffcategoryDto{
    @IsNotEmpty()
    @IsString()
    category:string
}
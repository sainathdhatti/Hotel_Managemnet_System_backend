import { PartialType } from "@nestjs/mapped-types";
import { CreateFoodDto } from "./createFoodDto";


export class UpadateFoodDto extends PartialType(CreateFoodDto){}
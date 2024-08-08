import { PartialType } from "@nestjs/mapped-types";
import { CreateAmenitiesDto } from "./create-amenities.dto";



export class UpdateAmenitiesDto extends PartialType(CreateAmenitiesDto){
    
}

import { PartialType } from "@nestjs/mapped-types";
import { CreateSuperAdminDto } from "./create-superadmin.dto";


export class UpdateSuperAdminDto extends PartialType(CreateSuperAdminDto){

}

import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomCategoryDto } from './create-roomcategories.dto';

export class UpdateRoomCategoryDto extends PartialType(CreateRoomCategoryDto) {}

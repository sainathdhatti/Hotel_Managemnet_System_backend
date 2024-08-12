import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FoodEntity} from "./food_itm.entity";
import { FooditemsController } from "./food_itm.controller";
import { FooditemsService } from "./food_itm.service";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";





@Module({
    imports: [TypeOrmModule.forFeature([FoodEntity]),CloudinaryModule],
    controllers: [FooditemsController],
    providers: [FooditemsService],
    exports:[FooditemsService]
  })
export class Food_itemsModule{}
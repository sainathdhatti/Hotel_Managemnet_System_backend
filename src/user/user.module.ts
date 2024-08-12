import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./user.controller";
import { UserEntity } from "./user.entity";
import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { FoodOrder } from "src/Food_module/Food_order/Food_order.entity";
import { FoodEntity } from "src/Food_module/Food_items/food_itm.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]),FoodOrder, FoodOrder, FoodEntity],
    controllers: [UserController],
    providers: [UserService],
    exports:[UserService]
  })
export class UserModule{}
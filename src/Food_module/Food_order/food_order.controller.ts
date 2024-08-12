import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { OrderService } from './food_order.service';
import { CreateOrderDto } from './dto/createFoodOrderDto.dto';
import { FoodOrder } from './Food_order.entity';
import { UpdateOrderDto } from './dto/updateFoodOrderDto.dto';


@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<FoodOrder> {
    return this.orderService.createOrder(createOrderDto);
  }


  @Get()
  async getAllOrders(): Promise<FoodOrder[]> {
    return this.orderService.getAllOrders();
  }

  @Get(':id')
  async getOrderById(@Param('id') id: number): Promise<FoodOrder> {
    return this.orderService.getOrderById(id);
  }

  @Put(':id')
  async updateOrder(@Param('id') id:number,@Body() updateOrderDto: UpdateOrderDto){
    return this.orderService.updateOrder(id,updateOrderDto)
  }
}

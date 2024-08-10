import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodOrder } from './Food_order.entity';
import { FoodEntity } from '../Food_items/food_itm.entity';
import { OrderItem } from './foodorderItem.entity';
import { CreateOrderDto } from './dto/createFoodOrderDto.dto';
import { plainToClass } from 'class-transformer';
import { UserEntity } from 'src/user/user.entity';
import { UpdateOrderDto } from './dto/updateFoodOrderDto.dto';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(FoodOrder)
    private readonly orderRepository: Repository<FoodOrder>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(FoodEntity)
    private readonly foodItemRepository: Repository<FoodEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const user = await this.userRepository.findOneBy({ id: createOrderDto.userId });
    if (!user) {
      this.logger.error(`User with ID ${createOrderDto.userId} not found`);
      throw new NotFoundException(`User with ID ${createOrderDto.userId} not found`);
    }

    this.logger.log('User found:', user);

    const order = new FoodOrder();
    order.user = user;
    order.orderItems = [];

    let totalPrice = 0;

    for (const itemDto of createOrderDto.orderItems) {
      const foodItem = await this.foodItemRepository.findOneBy({ food_id: itemDto.foodItemId });
      if (!foodItem) {
        this.logger.error(`Food item with ID ${itemDto.foodItemId} not found`);
        throw new NotFoundException(`Food item with ID ${itemDto.foodItemId} not found`);
      }

      const orderItem = new OrderItem();
      orderItem.foodItemId = foodItem.food_id;
      orderItem.quantity = itemDto.quantity;
      orderItem.price = foodItem.food_price * itemDto.quantity;
      orderItem.foodItem = foodItem;
      orderItem.order = order;

      order.orderItems.push(orderItem);
      totalPrice += orderItem.price;

      this.logger.log('Added item to order:', orderItem);
    }

    order.totalAmount = totalPrice;
    this.logger.log('Total price calculated:', totalPrice);

    const savedOrder = await this.orderRepository.save(order);
    this.logger.log('Order saved:', savedOrder);

    return plainToClass(FoodOrder, savedOrder, { excludeExtraneousValues: true });
  }

  async getAllOrders() {
    const orders = await this.orderRepository.find({ relations: ['orderItems', 'user'] });
    this.logger.log('Orders retrieved:', orders);

    return orders.map((order) =>
      plainToClass(FoodOrder, order, { excludeExtraneousValues: true }),
    );
  }

  async getOrderById(id: number){
    const order = await this.orderRepository.findOne({
      where: { order_id: id },
      relations: ['orderItems', 'user'],
    });

    if (!order) {
      this.logger.error(`Order with ID ${id} not found`);
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    this.logger.log('Order retrieved:', order);
    return plainToClass(FoodOrder, order, { excludeExtraneousValues: true });
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findOne({
      where: { order_id: id },
      relations: ['orderItems', 'user'],
    });

    if (!order) {
      this.logger.error(`Order with ID ${id} not found`);
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    this.logger.log('Order found:', order);

    const user = await this.userRepository.findOneBy({ id: updateOrderDto.userId });
    if (!user) {
      this.logger.error(`User with ID ${updateOrderDto.userId} not found`);
      throw new NotFoundException(`User with ID ${updateOrderDto.userId} not found`);
    }

    this.logger.log('User found:', user);
    order.user = user;

    await this.orderItemRepository.remove(order.orderItems);
    order.orderItems = [];
    let totalPrice = 0;

    for (const itemDto of updateOrderDto.orderItems) {
      const foodItem = await this.foodItemRepository.findOneBy({ food_id: itemDto.foodItemId });
      if (!foodItem) {
        this.logger.error(`Food item with ID ${itemDto.foodItemId} not found`);
        throw new NotFoundException(`Food item with ID ${itemDto.foodItemId} not found`);
      }

      const orderItem = new OrderItem();
      orderItem.foodItemId = foodItem.food_id;
      orderItem.quantity = itemDto.quantity;
      orderItem.price = foodItem.food_price * itemDto.quantity;
      orderItem.foodItem = foodItem;
      orderItem.order = order;

      order.orderItems.push(orderItem);
      totalPrice += orderItem.price;

      this.logger.log('Added item to order:', orderItem);
    }

    order.totalAmount = totalPrice;
    this.logger.log('Total price recalculated:', totalPrice);

    const updatedOrder = await this.orderRepository.save(order);
    this.logger.log('Order updated:', updatedOrder);
    return plainToClass(FoodOrder, updatedOrder, { excludeExtraneousValues: true });
  }
}

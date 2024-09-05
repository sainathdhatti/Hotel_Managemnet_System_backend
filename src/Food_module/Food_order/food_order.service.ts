import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodOrder } from './Food_order.entity';
import { FoodEntity } from '../Food_items/food_itm.entity';
import { OrderItem } from './foodorderItem.entity';
import { CreateOrderDto } from './dto/createFoodOrderDto.dto';
import { plainToClass } from 'class-transformer';
import { UserEntity } from 'src/user/user.entity';
import { OrderStatus, UpdateOrderDto } from './dto/updateFoodOrderDto.dto';

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
      orderItem.food_name=foodItem.food_name

      order.orderItems.push(orderItem);
      totalPrice += orderItem.price;
      this.logger.log('totalamount:', totalPrice);

      this.logger.log('Added item to order:', orderItem);
    }

    order.totalAmount = totalPrice;
    this.logger.log('Total price calculated:', totalPrice);

    const savedOrder = await this.orderRepository.save(order);
    console.log(savedOrder);
    
    this.logger.log('Order saved:', savedOrder);

    return plainToClass(FoodOrder, savedOrder, { excludeExtraneousValues: true });
  }

  async getAllOrders() {
    const orders = await this.orderRepository.find({ relations: ['orderItems', 'user'] });
    this.logger.log('Orders retrieved:', JSON.stringify(orders));

    return orders.map(order => this.formatOrderResponse(order));
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

    this.logger.log('Order retrieved:', JSON.stringify(order));
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
  
    // Update user if provided
    if (updateOrderDto.userId) {
      const user = await this.userRepository.findOneBy({ id: updateOrderDto.userId });
      if (!user) {
        this.logger.error(`User with ID ${updateOrderDto.userId} not found`);
        throw new NotFoundException(`User with ID ${updateOrderDto.userId} not found`);
      }
      order.user = user;
    }
  
    // Update order items if provided
    if (updateOrderDto.orderItems && Array.isArray(updateOrderDto.orderItems)) {
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
    }
  
    // Update status if provided
    if (updateOrderDto.status) {
      this.logger.log(`Updating status from ${order.status} to ${updateOrderDto.status}`);
      order.status = updateOrderDto.status;
  
      // Automatically update delivered_time if status is set to 'delivered'
      if (order.status === OrderStatus.DELIVERED) {
        order.delivered_time = new Date();
        this.logger.log(`Setting delivered_time to ${order.delivered_time}`);
      }
    }
  
    const updatedOrder = await this.orderRepository.save(order);
    this.logger.log('Order updated:', JSON.stringify(updatedOrder));
    return plainToClass(FoodOrder, updatedOrder, { excludeExtraneousValues: true });
  }

  private formatOrderResponse(order: FoodOrder) {
    return {
      id: order.order_id,
      totalAmount: order.totalAmount.toString(), // Ensure totalAmount is a string
      order_time: order.order_time.toISOString(), // ISO string format
      delivered_time: order.delivered_time ? order.delivered_time.toISOString() : null,
      status: order.status,
      orderItems: order.orderItems.map(item => ({
        id: item.id,
        foodItemId: item.foodItemId,
        quantity: item.quantity,
        price: item.price.toString(), 
        food_name:item.food_name
      })),
      user: {
        id: order.user.id,
        email: order.user.email,
        firstName: order.user.firstName,
        lastName: order.user.lastName,
        phoneNumber: order.user.phoneNumber,
      },
    };
  }
  
}

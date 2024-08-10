import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './food_order.controller';
import { OrderService } from './food_order.service';
import { CreateOrderDto } from './dto/createFoodOrderDto.dto';
import { UpdateOrderDto } from './dto/updateFoodOrderDto.dto';
import { FoodOrder } from './Food_order.entity';
import { NotFoundException } from '@nestjs/common';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  // Mocking the OrderService
  const mockOrderService = {
    createOrder: jest.fn(),
    getAllOrders: jest.fn(),
    getOrderById: jest.fn(),
    updateOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create an order and return it', async () => {
      const createOrderDto: CreateOrderDto = {
        userId: 1,
        orderItems: [{ foodItemId: 1, quantity: 2 }],
      };

      const result: FoodOrder = {
        order_id: 1,
        user: { id: 1, name: 'Test User' } as any,
        orderItems: [{ id: 1, foodItemId: 1, quantity: 2, price: 20 }] as any,
        totalAmount: 20,
      };

      jest.spyOn(service, 'createOrder').mockResolvedValue(result);

      expect(await controller.createOrder(createOrderDto)).toEqual(result);
    });
  });

  describe('getAllOrders', () => {
    it('should return an array of orders', async () => {
      const result: FoodOrder[] = [
        {
          order_id: 1,
          user: { id: 1, name: 'Test User' } as any,
          orderItems: [{ id: 1, foodItemId: 1, quantity: 2, price: 20 }] as any,
          totalAmount: 20,
        },
      ];

      jest.spyOn(service, 'getAllOrders').mockResolvedValue(result);

      expect(await controller.getAllOrders()).toEqual(result);
    });
  });

  describe('getOrderById', () => {
    it('should return a single order by ID', async () => {
      const result: FoodOrder = {
        order_id: 1,
        user: { id: 1, name: 'Test User' } as any,
        orderItems: [{ id: 1, foodItemId: 1, quantity: 2, price: 20 }] as any,
        totalAmount: 20,
      };

      jest.spyOn(service, 'getOrderById').mockResolvedValue(result);

      expect(await controller.getOrderById(1)).toEqual(result);
    });

    it('should throw NotFoundException if order not found', async () => {
      jest.spyOn(service, 'getOrderById').mockRejectedValue(new NotFoundException('Order not found'));

      await expect(controller.getOrderById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateOrder', () => {
    it('should update an order and return it', async () => {
      const updateOrderDto: UpdateOrderDto = {
        userId: 1,
        orderItems: [{ foodItemId: 1, quantity: 3 }],
        totalAmount: 30,
      };

      const result: FoodOrder = {
        order_id: 1,
        user: { id: 1, name: 'Test User' } as any,
        orderItems: [{ id: 1, foodItemId: 1, quantity: 3, price: 30 }] as any,
        totalAmount: 30,
      };

      jest.spyOn(service, 'updateOrder').mockResolvedValue(result);

      expect(await controller.updateOrder(1, updateOrderDto)).toEqual(result);
    });

    it('should throw NotFoundException if order not found', async () => {
      const updateOrderDto: UpdateOrderDto = {
        userId: 1,
        orderItems: [{ foodItemId: 1, quantity: 3 }],
        totalAmount: 30,
      };

      jest.spyOn(service, 'updateOrder').mockRejectedValue(new NotFoundException('Order not found'));

      await expect(controller.updateOrder(999, updateOrderDto)).rejects.toThrow(NotFoundException);
    });
  });
});

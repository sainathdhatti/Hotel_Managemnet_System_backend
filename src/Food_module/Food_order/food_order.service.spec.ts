import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderService } from './food_order.service';
import { FoodOrder } from './Food_order.entity';
import { OrderItem } from './foodorderItem.entity';
import { FoodEntity } from '../Food_items/food_itm.entity';
import { UserEntity } from 'src/user/user.entity';
import { CreateOrderDto } from './dto/createFoodOrderDto.dto';
import { UpdateOrderDto } from './dto/updateFoodOrderDto.dto';


describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Repository<FoodOrder>;
  let orderItemRepository: Repository<OrderItem>;
  let foodItemRepository: Repository<FoodEntity>;
  let userRepository: Repository<UserEntity>;

  const mockOrderRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockOrderItemRepository = {
    remove: jest.fn(),
  };

  const mockFoodItemRepository = {
    findOneBy: jest.fn(),
  };

  const mockUserRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: getRepositoryToken(FoodOrder), useValue: mockOrderRepository },
        { provide: getRepositoryToken(OrderItem), useValue: mockOrderItemRepository },
        { provide: getRepositoryToken(FoodEntity), useValue: mockFoodItemRepository },
        { provide: getRepositoryToken(UserEntity), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get<Repository<FoodOrder>>(getRepositoryToken(FoodOrder));
    orderItemRepository = module.get<Repository<OrderItem>>(getRepositoryToken(OrderItem));
    foodItemRepository = module.get<Repository<FoodEntity>>(getRepositoryToken(FoodEntity));
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  describe('createOrder', () => {
    it('should create a new order successfully', async () => {
      const createOrderDto: CreateOrderDto = {
        userId: 1,
        orderItems: [{ foodItemId: 1, quantity: 2 }],
      };

      const user = new UserEntity();
      user.id = 1;

      const foodItem = new FoodEntity();
      foodItem.food_id = 1;
      foodItem.food_price = 10;

      const order = new FoodOrder();
      order.order_id = 1;
      order.totalAmount = 20;
      order.user = user;
      order.orderItems = [
        {
          id: 1,
          foodItemId: 1,
          quantity: 2,
          price: 20,
          foodItem: foodItem,
          order: order,
        } as OrderItem,
      ];

      mockUserRepository.findOneBy.mockResolvedValue(user);
      mockFoodItemRepository.findOneBy.mockResolvedValue(foodItem);
      mockOrderRepository.save.mockResolvedValue(order);

      const result = await service.createOrder(createOrderDto);

      expect(result).toEqual(order);
      expect(mockOrderRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        user,
        orderItems: expect.any(Array),
        totalAmount: 20,
      }));
    });
  });

  describe('getAllOrders', () => {
    it('should return all orders', async () => {
      const orders = [new FoodOrder()];
      mockOrderRepository.find.mockResolvedValue(orders);

      const result = await service.getAllOrders();

      expect(result).toEqual(orders);
      expect(mockOrderRepository.find).toHaveBeenCalledWith({ relations: ['orderItems', 'user'] });
    });
  });

  describe('getOrderById', () => {
    it('should return an order by ID', async () => {
      const order = new FoodOrder();
      order.order_id = 1;
      mockOrderRepository.findOne.mockResolvedValue(order);

      const result = await service.getOrderById(1);

      expect(result).toEqual(order);
      expect(mockOrderRepository.findOne).toHaveBeenCalledWith({
        where: { order_id: 1 },
        relations: ['orderItems', 'user'],
      });
    });
  });

  describe('updateOrder', () => {
    it('should update an order successfully', async () => {
      const updateOrderDto: UpdateOrderDto = {
        userId: 1,
        orderItems: [{ foodItemId: 1, quantity: 3 }],
        totalAmount: 30,
      };

      const existingOrder = new FoodOrder();
      existingOrder.order_id = 1;
      existingOrder.totalAmount = 20;
      existingOrder.user = new UserEntity();
      existingOrder.orderItems = [];

      const user = new UserEntity();
      user.id = 1;

      const foodItem = new FoodEntity();
      foodItem.food_id = 1;
      foodItem.food_price = 10;

      const updatedOrder = new FoodOrder();
      updatedOrder.order_id = 1;
      updatedOrder.totalAmount = 30;
      updatedOrder.user = user;
      updatedOrder.orderItems = [
        {
          id: 1,
          foodItemId: 1,
          quantity: 3,
          price: 30,
          foodItem: foodItem,
          order: updatedOrder,
        } as OrderItem,
      ];

      mockOrderRepository.findOne.mockResolvedValue(existingOrder);
      mockUserRepository.findOneBy.mockResolvedValue(user);
      mockFoodItemRepository.findOneBy.mockResolvedValue(foodItem);
      mockOrderRepository.save.mockResolvedValue(updatedOrder);

      const result = await service.updateOrder(1, updateOrderDto);

      expect(result).toEqual(updatedOrder);
      expect(mockOrderRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        user,
        orderItems: expect.any(Array),
        totalAmount: 30,
      }));
    });
  });
});

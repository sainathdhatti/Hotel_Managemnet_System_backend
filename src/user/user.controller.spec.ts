import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { CreateUserDto } from './dto/CreateUserDto.dto';
import { UpdateUserDto } from './dto/UpdateUserDto.dto';


describe('UserController', () => {
  let userController: UserController;
  const mockUserService = {
    getAllUsers: jest.fn(),
    getUser: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'test', signOptions: { expiresIn: '60s' } }), ConfigModule.forRoot()],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const user = {
        email: 'xyz@gmail.com',
        name: 'xyz',
        phoneNumber: '1234567890',
        password: 'password123',
        aadharCardNumber: '1234-5678-9123',
      };

      const users = [user];
      jest.spyOn(mockUserService, 'getAllUsers').mockResolvedValue(users);

      const result = await userController.getAllUsers();

      expect(mockUserService.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('getUserById', () => {
    it('should return a user by a given id', async () => {
      const id = 1;
      const user = {
        id: 1,
        email: 'xyz@gmail.com',
        name: 'xyz',
        phoneNumber: '1234567890',
        password: 'password123',
        aadharCardNumber: '1234-5678-9123',
      };

      jest.spyOn(mockUserService, 'getUser').mockResolvedValue(user);

      const result = await userController.getUser(id);

      expect(mockUserService.getUser).toHaveBeenCalled();
      expect(mockUserService.getUser).toHaveBeenCalledWith(id);
      expect(result).toEqual(user);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userDto: CreateUserDto = {
        name: 'RohanJ',
        email: 'rohanj@valueaddsofttech.com',
        phoneNumber: '0987654321',
        password: '123456',
        aadharCardNumber: '9876-5432-1098',
      };

      const createdUser= {
        id: 2,
        ...userDto,
      };

      jest.spyOn(mockUserService, 'createUser').mockResolvedValue(createdUser);

      const result = await userController.createUser(userDto);

      expect(mockUserService.createUser).toHaveBeenCalled();
      expect(mockUserService.createUser).toHaveBeenCalledWith(userDto);
      expect(result).toEqual(createdUser);
    });
  });

  describe('updateUser', () => {
    it('should update a user by a given id with the provided data', async () => {
      const id = 2;
      const updateUserDto: UpdateUserDto = {
        name: 'xyz',
        // other fields if necessary
      };

      const updatedUser = {
        id,
        ...updateUserDto,
      };

      jest.spyOn(mockUserService, 'updateUser').mockResolvedValue(updatedUser);

      const result = await userController.updateUser(id, updateUserDto);

      expect(mockUserService.updateUser).toHaveBeenCalled();
      expect(mockUserService.updateUser).toHaveBeenCalledWith(id, updateUserDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by a given id and return a success message', async () => {
      const id = 3;

      const output = {
        raw: [],
        affected: 1,
      };

      jest.spyOn(mockUserService, 'deleteUser').mockResolvedValue(output);

      const result = await userController.deleteUser(id);

      expect(mockUserService.deleteUser).toHaveBeenCalled();
      expect(mockUserService.deleteUser).toHaveBeenCalledWith(id);
      expect(result).toEqual({ message: 'User deleted successfully' });
    });
  });
});

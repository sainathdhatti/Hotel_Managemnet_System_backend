import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'database.type':
                  return 'mysql';
                case 'port':
                  return 3000;
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    mailerService = module.get<MailerService>(MailerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('should return all users from the repository', async () => {
    const mockUsers = [
      {
        id: 1,
        email: 'user1@example.com',
        passwordHash: await bcrypt.hash('password1', 10),
        name: 'User 1',
      },
      {
        id: 2,
        email: 'user2@example.com',
        passwordHash: await bcrypt.hash('password2', 10),
        name: 'User 2',
      },
    ] as UserEntity[];

    jest.spyOn(userRepository, 'find').mockResolvedValue(mockUsers);

    const result = await service.getAllUsers();

    expect(result).toEqual(mockUsers);
    expect(userRepository.find).toHaveBeenCalled();
  });

  it('should return a user by ID', async () => {
    const userId = 1;
    const mockUser = {
      id: 1,
      email: 'user1@example.com',
      passwordHash: "ghhjkpo1234",
      name: 'User 1',
      phoneNumber: "12345678",
      aadharCardNumber: '555667788',
    } as UserEntity;
  
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
  
    const result = await service.getUser(userId);
  
    expect(result).toEqual(mockUser);
    expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
  });
  

 

  it('should update a user by ID', async () => {
    const userId = 1;
    const updateUserDto = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        passwordHash: 'password123',
        phoneNumber:'12345678',
        aadharCardNumber:'888899990000'
    };

    const mockUser = {
      id: 1,
      name: 'Jane Doe',
      email: 'jane@example.com',
      passwordHash: 'password123',
      phoneNumber:'12345678',
      aadharCardNumber:'888899990000'
      
    };

    jest.spyOn(service, 'updateUser').mockResolvedValue(mockUser);


    const result = await service.updateUser(userId, updateUserDto);

    expect(result).toEqual(mockUser);
  });

  it('should delete a user by ID', async () => {
    const userId = 1;
    const mockUser = {
      id: userId,
      email: 'user1@example.com',
      passwordHash: 'ghhjkpo1234',
      name: 'User 1',
      phoneNumber: '12345678',
      aadharCardNumber: '555667788',
    } as UserEntity;
  
    jest.spyOn(service, 'getUser').mockResolvedValue(mockUser);
    jest.spyOn(userRepository, 'remove').mockResolvedValue(mockUser);
  
    await service.deleteUser(userId);
  
    expect(service.getUser).toHaveBeenCalledWith(userId);
    expect(userRepository.remove).toHaveBeenCalledWith(mockUser);
  });
  
  

 
});

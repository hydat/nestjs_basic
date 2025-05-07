import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotFoundException } from '@nestjs/common';
import { Redis } from 'ioredis';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { EmailService } from 'src/email/email.service';

describe('UserService - getUserById', () => {
  let userService: UserService;
  let mockUserRepository: any;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: EmailService,
          useValue: { sendWelcomeEmail: jest.fn() },
        },
        {
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },
        {
          provide: 'REDIS_CLIENT',
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should return user when found', async () => {
    const mockUser = { id: 1, name: 'Alice' };
    mockUserRepository.findOne.mockResolvedValue(mockUser);

    const result = await userService.getUserById(1);
    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundException when user not found', async () => {
    mockUserRepository.findOne.mockResolvedValue(null);

    await expect(userService.getUserById(999)).rejects.toThrow(
      new NotFoundException('User with ID 999 not found'),
    );
  });
});

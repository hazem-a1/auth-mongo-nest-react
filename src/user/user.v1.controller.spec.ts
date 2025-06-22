import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UserController } from './user.v1.controller';
import { UserService } from './user.service';
import { createMockUserDocument } from '../test/test-utils';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users successfully', async () => {
      const mockUsers = [
        createMockUserDocument({ firstName: 'John', lastName: 'Doe' }),
        createMockUserDocument({ firstName: 'Jane', lastName: 'Smith' }),
      ];

      userService.findAll.mockResolvedValue(mockUsers as any);

      const result = await controller.findAll();

      expect(userService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no users exist', async () => {
      userService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(userService.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle service errors', async () => {
      const error = new Error('Database connection failed');

      userService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('should return users', async () => {
      const mockUsers = [
        createMockUserDocument({ firstName: 'John', lastName: 'Doe' }),
      ];

      userService.findAll.mockResolvedValue(mockUsers as any);

      const result = await controller.findAll();

      expect(result[0]).toHaveProperty('firstName');
      expect(result[0]).toHaveProperty('lastName');
      expect(result[0]).toHaveProperty('email');
      expect(result[0]).toHaveProperty('provider');
    });
  });

  describe('findOne', () => {
    it('should return a user by id successfully', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const mockUser = createMockUserDocument({
        firstName: 'John',
        lastName: 'Doe',
      });

      userService.findOne.mockResolvedValue(mockUser as any);

      const result = await controller.findOne(userId);

      expect(userService.findOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });


    it('should handle service errors when finding user', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const error = new Error('Database error');

      userService.findOne.mockRejectedValue(error as any);

      await expect(controller.findOne(userId)).rejects.toThrow(
        'Database error',
      );
    });

    it('should return user', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const mockUser = createMockUserDocument({
        firstName: 'John',
        lastName: 'Doe',
      });

      userService.findOne.mockResolvedValue(mockUser as any);

      const result = await controller.findOne(userId);

      expect(result).toHaveProperty('firstName');
      expect(result).toHaveProperty('lastName');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('provider');
    });

    it('should handle empty string id', async () => {
      const userId = '';
      const mockUser = createMockUserDocument();

      userService.findOne.mockResolvedValue(mockUser as any);

      const result = await controller.findOne(userId);

      expect(userService.findOne).toHaveBeenCalledWith('');
      expect(result).toEqual(mockUser);
    });
  });

  describe('edge cases', () => {
    it('should handle users with missing optional fields', async () => {
      const mockUsers = [
        createMockUserDocument({
          firstName: 'John',
          lastName: 'Doe',
          password: undefined,
        }),
      ];

      userService.findAll.mockResolvedValue(mockUsers as any);

      const result = await controller.findAll();

      expect(result[0]).toHaveProperty('firstName', 'John');
      expect(result[0]).toHaveProperty('lastName', 'Doe');
      expect(result[0]).toHaveProperty('email');
      expect(result[0]).toHaveProperty('provider');
    });

    it('should handle very long user IDs', async () => {
      const userId = '507f1f77bcf86cd799439011507f1f77bcf86cd799439011';
      const mockUser = createMockUserDocument();

      userService.findOne.mockResolvedValue(mockUser as any);

      const result = await controller.findOne(userId);

      expect(userService.findOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });

    it('should handle special characters in user ID', async () => {
      const userId = '507f1f77bcf86cd799439011!@#$%^&*()';
      const mockUser = createMockUserDocument();

      userService.findOne.mockResolvedValue(mockUser as any);

      const result = await controller.findOne(userId);

      expect(userService.findOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });
  });

  describe('API documentation compliance', () => {
    it('should return users in expected format for API docs', async () => {
      const mockUsers = [
        createMockUserDocument({
          firstName: 'John Doe',
          lastName: 'Doe',
          email: 'example@hello.world',
        }),
      ];

      userService.findAll.mockResolvedValue(mockUsers as any);

      const result = await controller.findAll();

      expect(result[0]).toMatchObject({
        _id: mockUsers[0]._id,
        firstName: 'John Doe',
        lastName: 'Doe',
        email: 'example@hello.world',
      });
    });

    it('should return single user in expected format for API docs', async () => {
      const mockUser = createMockUserDocument({
        firstName: 'John Doe',
        lastName: 'Doe',
        email: 'example@hello.world',
      });
      const userId = mockUser._id;

      userService.findOne.mockResolvedValue(mockUser as any);

      const result = await controller.findOne(userId);

      expect(result).toMatchObject({
        _id: mockUser._id,
        firstName: 'John Doe',
        lastName: 'Doe',
        email: 'example@hello.world',
      });
    });
  });
});

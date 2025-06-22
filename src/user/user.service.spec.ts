import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { createMockUserDocument, mockMongooseModel } from '../test/test-utils';

describe('UserService', () => {
  let service: UserService;
  let userModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockMongooseModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users without password and __v fields', async () => {
      const mockUsers = [
        createMockUserDocument({ firstName: 'John', lastName: 'Doe' }),
        createMockUserDocument({ firstName: 'Jane', lastName: 'Smith' }),
      ];

      userModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUsers),
      });

      const result = await service.findAll();

      expect(userModel.find).toHaveBeenCalledWith({}, '-password -__v');
      expect(result).toEqual(mockUsers);
    });

    it('should handle database errors when finding all users', async () => {
      const error = new Error('Database error');

      userModel.find.mockReturnValue({
        exec: jest.fn().mockRejectedValue(error),
      });

      await expect(service.findAll()).rejects.toThrow('Database error');
    });
  });

  describe('findOne', () => {
    it('should return a user by id without password and __v fields', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const mockUser = createMockUserDocument();

      userModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findOne(userId);

      expect(userModel.findOne).toHaveBeenCalledWith(
        { _id: userId },
        '-password -__v',
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found', async () => {
      const userId = '507f1f77bcf86cd799439011';

      userModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.findOne(userId);

      expect(userModel.findOne).toHaveBeenCalledWith(
        { _id: userId },
        '-password -__v',
      );
      expect(result).toBeNull();
    });

    it('should handle database errors when finding user by id', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const error = new Error('Database error');

      userModel.findOne.mockReturnValue({
        exec: jest.fn().mockRejectedValue(error),
      });

      await expect(service.findOne(userId)).rejects.toThrow('Database error');
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'john.doe@example.com';
      const mockUser = createMockUserDocument();

      userModel.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail(email);

      expect(userModel.findOne).toHaveBeenCalledWith({ email });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user with email is not found', async () => {
      const email = 'nonexistent@example.com';

      userModel.findOne.mockResolvedValue(null);

      const result = await service.findByEmail(email);

      expect(userModel.findOne).toHaveBeenCalledWith({ email });
      expect(result).toBeNull();
    });

    it('should handle database errors when finding user by email', async () => {
      const email = 'john.doe@example.com';
      const error = new Error('Database error');

      userModel.findOne.mockRejectedValue(error);

      await expect(service.findByEmail(email)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('delete', () => {
    it('should delete a user by id successfully', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const deletedUser = createMockUserDocument();

      userModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(deletedUser),
      });

      const result = await service.delete(userId);

      expect(userModel.findByIdAndDelete).toHaveBeenCalledWith({ _id: userId });
      expect(result).toEqual(deletedUser);
    });

    it('should return null when user to delete is not found', async () => {
      const userId = '507f1f77bcf86cd799439011';

      userModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.delete(userId);

      expect(userModel.findByIdAndDelete).toHaveBeenCalledWith({ _id: userId });
      expect(result).toBeNull();
    });

    it('should handle database errors when deleting user', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const error = new Error('Database error');

      userModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockRejectedValue(error),
      });

      await expect(service.delete(userId)).rejects.toThrow('Database error');
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const updateData = { firstName: 'Updated', lastName: 'Name' };
      const updatedUser = createMockUserDocument(updateData);

      userModel.findByIdAndUpdate.mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateData);

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: userId },
        updateData,
        { new: true },
      );
      expect(result).toEqual(updatedUser);
    });

    it('should return null when user to update is not found', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const updateData = { firstName: 'Updated' };

      userModel.findByIdAndUpdate.mockResolvedValue(null);

      const result = await service.update(userId, updateData);

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: userId },
        updateData,
        { new: true },
      );
      expect(result).toBeNull();
    });

    it('should handle database errors when updating user', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const updateData = { firstName: 'Updated' };
      const error = new Error('Database error');

      userModel.findByIdAndUpdate.mockRejectedValue(error);

      await expect(service.update(userId, updateData)).rejects.toThrow(
        'Database error',
      );
    });

    it('should handle null update data', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const updateData = null as any;
      const updatedUser = createMockUserDocument();

      userModel.findByIdAndUpdate.mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateData);

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: userId },
        null,
        { new: true },
      );
      expect(result).toEqual(updatedUser);
    });
  });

  describe('edge cases', () => {
    it('should handle empty string id', async () => {
      const userId = '';
      const mockUser = createMockUserDocument();

      userModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findOne(userId);

      expect(userModel.findOne).toHaveBeenCalledWith(
        { _id: '' },
        '-password -__v',
      );
      expect(result).toEqual(mockUser);
    });
  });
});

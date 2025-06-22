import { User } from '../user/schema/user.schema';
import { RegisterRequestDto } from '../auth/dto/register-request.dto';
import { LoginRequestDto } from '../auth/dto/login-request.dto';
import { AuthProvider } from '../user/enum/userProvider.enum';

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'hashed-password',
  provider: AuthProvider.LOCAL,
  ...overrides,
});

export const createMockUserDocument = (overrides: Partial<User> = {}) => {
  const user = createMockUser(overrides);
  return {
    ...user,
    _id: '507f1f77bcf86cd799439011',
    id: '507f1f77bcf86cd799439011',
    save: jest.fn().mockResolvedValue(user),
    toObject: jest.fn().mockReturnValue(user),
  };
};

export const createMockRegisterDto = (
  overrides: Partial<RegisterRequestDto> = {},
): RegisterRequestDto => ({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'password123',
  ...overrides,
});

export const createMockLoginDto = (
  overrides: Partial<LoginRequestDto> = {},
): LoginRequestDto => ({
  email: 'john.doe@example.com',
  password: 'password123',
  ...overrides,
});

export const createMockAccessToken = () => ({
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
});

export const createMockRequest = (overrides: any = {}) => ({
  user: createMockUserDocument(),
  headers: {
    authorization: 'Bearer mock-token',
  },
  body: {},
  params: {},
  query: {},
  ...overrides,
});

export const createMockResponse = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
});

export const mockMongooseModel = {
  find: jest.fn().mockReturnThis(),
  findOne: jest.fn().mockReturnThis(),
  findByIdAndDelete: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  create: jest.fn().mockReturnThis(),
  exec: jest.fn(),
  new: jest.fn(),
  save: jest.fn(),
};

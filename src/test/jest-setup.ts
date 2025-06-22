import { ConfigModule } from '@nestjs/config';

// Mock environment variables for testing
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.REFRESH_JWT_SECRET = 'test-refresh-jwt-secret';
process.env.REFRESH_TOKEN_VALIDITY_DURATION_IN_SEC = '3600';
process.env.MONGO_URI = 'mongodb://localhost:27017/test';

// Global test configuration
export const TestConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env.test',
});

// Mock bcrypt for consistent testing
jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('test-salt'),
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Mock JWT service
jest.mock('@nestjs/jwt', () => ({
  JwtService: jest.fn().mockImplementation(() => ({
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
    verify: jest
      .fn()
      .mockReturnValue({ sub: 'test-user-id', email: 'test@example.com' }),
  })),
}));

// Mock mongoose
jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  Model: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn(),
}));

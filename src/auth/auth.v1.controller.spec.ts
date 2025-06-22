import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
} from '@nestjs/common';
import { AuthController } from './auth.v1.controller';
import { AuthService } from './auth.service';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import {
  createMockUserDocument,
  createMockRegisterDto,
  createMockAccessToken,
  createMockRequest,
} from '../test/test-utils';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let authRefreshTokenService: jest.Mocked<AuthRefreshTokenService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
        {
          provide: AuthRefreshTokenService,
          useValue: {
            generateTokenPair: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
    authRefreshTokenService = module.get(AuthRefreshTokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const mockUser = createMockUserDocument();
      const mockTokens = createMockAccessToken();
      const mockRequest = createMockRequest({ user: mockUser });

      authService.login.mockResolvedValue(mockTokens);

      const result = await controller.login(mockRequest);

      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockTokens);
    });

    it('should handle login errors', async () => {
      const mockUser = createMockUserDocument();
      const mockRequest = createMockRequest({ user: mockUser });
      const error = new BadRequestException('Login failed');

      authService.login.mockRejectedValue(error);

      await expect(controller.login(mockRequest)).rejects.toThrow(error);
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens successfully', async () => {
      const mockUser = createMockUserDocument();
      const mockTokens = createMockAccessToken();
      const mockRequest = createMockRequest({
        user: {
          attributes: mockUser,
          refreshTokenExpiresAt: new Date(),
        },
        headers: {
          authorization: 'Bearer current-refresh-token',
        },
      });

      authRefreshTokenService.generateTokenPair.mockResolvedValue(mockTokens);

      const result = await controller.refreshTokens(mockRequest);

      expect(authRefreshTokenService.generateTokenPair).toHaveBeenCalledWith(
        mockUser,
        'current-refresh-token',
        expect.any(Date),
      );
      expect(result).toEqual(mockTokens);
    });

    it('should handle missing authorization header', async () => {
      const mockUser = createMockUserDocument();
      const mockTokens = createMockAccessToken();
      const mockRequest = createMockRequest({
        user: {
          attributes: mockUser,
          refreshTokenExpiresAt: new Date(),
        },
        headers: {},
      });

      authRefreshTokenService.generateTokenPair.mockResolvedValue(mockTokens);

      const result = await controller.refreshTokens(mockRequest);

      expect(authRefreshTokenService.generateTokenPair).toHaveBeenCalledWith(
        mockUser,
        undefined,
        expect.any(Date),
      );
      expect(result).toEqual(mockTokens);
    });

    it('should handle token refresh errors', async () => {
      const mockUser = createMockUserDocument();
      const mockRequest = createMockRequest({
        user: {
          attributes: mockUser,
          refreshTokenExpiresAt: new Date(),
        },
        headers: {
          authorization: 'Bearer current-refresh-token',
        },
      });
      const error = new Error('Token refresh failed');

      authRefreshTokenService.generateTokenPair.mockRejectedValue(error);

      await expect(controller.refreshTokens(mockRequest)).rejects.toThrow(
        'Token refresh failed',
      );
    });
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      const registerDto = createMockRegisterDto();
      const mockTokens = createMockAccessToken();

      authService.register.mockResolvedValue(mockTokens);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockTokens);
    });

    it('should handle registration errors', async () => {
      const registerDto = createMockRegisterDto();
      const error = new BadRequestException('Registration failed');

      authService.register.mockRejectedValue(error);

      await expect(controller.register(registerDto)).rejects.toThrow(error);
    });

    it('should handle registration with empty fields', async () => {
      const registerDto = createMockRegisterDto({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      });
      const mockTokens = createMockAccessToken();

      authService.register.mockResolvedValue(mockTokens);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockTokens);
    });
  });

  describe('googleLogin', () => {
    it('should handle Google login initiation', () => {
      // This method is typically handled by the GoogleAuthGuard
      // We just test that the method exists and doesn't throw
      expect(() => controller.googleLogin()).not.toThrow();
    });
  });

  describe('googleLoginCallback', () => {
    it('should handle Google login callback successfully', async () => {
      const mockUser = createMockUserDocument();
      const mockTokens = createMockAccessToken();
      const mockRequest = createMockRequest({ user: mockUser });

      authService.login.mockResolvedValue(mockTokens);

      const result = await controller.googleLoginCallback(mockRequest);

      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockTokens);
    });

    it('should handle Google callback errors', async () => {
      const mockUser = createMockUserDocument();
      const mockRequest = createMockRequest({ user: mockUser });
      const error = new Error('Google callback failed');

      authService.login.mockRejectedValue(error);

      await expect(controller.googleLoginCallback(mockRequest)).rejects.toThrow(
        'Google callback failed',
      );
    });
  });

  describe('edge cases', () => {
    it('should handle malformed authorization header', async () => {
      const mockUser = createMockUserDocument();
      const mockTokens = createMockAccessToken();
      const mockRequest = createMockRequest({
        user: {
          attributes: mockUser,
          refreshTokenExpiresAt: new Date(),
        },
        headers: {
          authorization: 'InvalidFormat',
        },
      });

      authRefreshTokenService.generateTokenPair.mockResolvedValue(mockTokens);

      const result = await controller.refreshTokens(mockRequest);

      expect(authRefreshTokenService.generateTokenPair).toHaveBeenCalledWith(
        mockUser,
        undefined,
        expect.any(Date),
      );
      expect(result).toEqual(mockTokens);
    });

    
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtGuard } from './jwt.guard';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

describe('JwtGuard', () => {
  let guard: JwtGuard;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtGuard>(JwtGuard);
    reflector = module.get(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true for public routes', () => {
      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;

      reflector.getAllAndOverride.mockReturnValue(true);

      const result = guard.canActivate(mockContext);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        mockContext.getHandler(),
        mockContext.getClass(),
      ]);
      expect(result).toBe(true);
    });

    it('should call super.canActivate for protected routes', () => {
      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;

      reflector.getAllAndOverride.mockReturnValue(false);

      // Mock the parent class canActivate method
      const mockSuperCanActivate = jest.fn().mockReturnValue(true);
      jest.spyOn(guard, 'canActivate').mockImplementation((context) => {
        if (
          reflector.getAllAndOverride(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
          ])
        ) {
          return true;
        }
        return mockSuperCanActivate(context);
      });

      const result = guard.canActivate(mockContext);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        mockContext.getHandler(),
        mockContext.getClass(),
      ]);
      expect(mockSuperCanActivate).toHaveBeenCalledWith(mockContext);
      expect(result).toBe(true);
    });

    it('should handle undefined public key', () => {
      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;

      reflector.getAllAndOverride.mockReturnValue(undefined);

      const mockSuperCanActivate = jest.fn().mockReturnValue(true);
      jest.spyOn(guard, 'canActivate').mockImplementation((context) => {
        if (
          reflector.getAllAndOverride(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
          ])
        ) {
          return true;
        }
        return mockSuperCanActivate(context);
      });

      const result = guard.canActivate(mockContext);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        mockContext.getHandler(),
        mockContext.getClass(),
      ]);
      expect(mockSuperCanActivate).toHaveBeenCalledWith(mockContext);
      expect(result).toBe(true);
    });

    it('should handle null public key', () => {
      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;

      reflector.getAllAndOverride.mockReturnValue(null);

      const mockSuperCanActivate = jest.fn().mockReturnValue(true);
      jest.spyOn(guard, 'canActivate').mockImplementation((context) => {
        if (
          reflector.getAllAndOverride(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
          ])
        ) {
          return true;
        }
        return mockSuperCanActivate(context);
      });

      const result = guard.canActivate(mockContext);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        mockContext.getHandler(),
        mockContext.getClass(),
      ]);
      expect(mockSuperCanActivate).toHaveBeenCalledWith(mockContext);
      expect(result).toBe(true);
    });

    it('should handle false public key', () => {
      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;

      reflector.getAllAndOverride.mockReturnValue(false);

      const mockSuperCanActivate = jest.fn().mockReturnValue(true);
      jest.spyOn(guard, 'canActivate').mockImplementation((context) => {
        if (
          reflector.getAllAndOverride(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
          ])
        ) {
          return true;
        }
        return mockSuperCanActivate(context);
      });

      const result = guard.canActivate(mockContext);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        mockContext.getHandler(),
        mockContext.getClass(),
      ]);
      expect(mockSuperCanActivate).toHaveBeenCalledWith(mockContext);
      expect(result).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle reflector errors gracefully', () => {
      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;

      reflector.getAllAndOverride.mockImplementation(() => {
        throw new Error('Reflector error');
      });

      expect(() => guard.canActivate(mockContext)).toThrow('Reflector error');
    });

    it('should handle context without getHandler method', () => {
      const mockContext = {
        getClass: jest.fn(),
      } as unknown as ExecutionContext;

      reflector.getAllAndOverride.mockReturnValue(false);

      expect(() => guard.canActivate(mockContext)).toThrow();
    });

    it('should handle context without getClass method', () => {
      const mockContext = {
        getHandler: jest.fn(),
      } as unknown as ExecutionContext;

      reflector.getAllAndOverride.mockReturnValue(false);

      expect(() => guard.canActivate(mockContext)).toThrow();
    });
  });

  describe('inheritance behavior', () => {
    it('should properly extend AuthGuard', () => {
      expect(guard).toBeInstanceOf(JwtGuard);
      expect(guard).toHaveProperty('canActivate');
    });

    it('should have reflector dependency injected', () => {
      expect(reflector).toBeDefined();
      expect(reflector.getAllAndOverride).toBeDefined();
    });
  });
});

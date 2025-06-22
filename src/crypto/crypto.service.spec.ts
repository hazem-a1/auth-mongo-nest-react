import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';
import * as bcrypt from 'bcrypt';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoService],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateHash', () => {
    it('should generate a hash for a password', async () => {
      const password = 'testPassword123';
      const mockHash = 'hashedPassword123';

      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('testSalt' as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(mockHash as never);

      const result = await service.generateHash(password);

      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 'testSalt');
      expect(result).toBe(mockHash);
    });

    it('should handle bcrypt errors gracefully', async () => {
      const password = 'testPassword123';
      const error = new Error('Bcrypt error');

      jest.spyOn(bcrypt, 'genSalt').mockRejectedValue(error as never);

      await expect(service.generateHash(password)).rejects.toThrow(
        'Bcrypt error',
      );
    });
  });

  describe('compareHash', () => {
    it('should return true when password matches hash', async () => {
      const password = 'testPassword123';
      const hash = 'hashedPassword123';

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.compareHash(password, hash);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(true);
    });

    it('should return false when password does not match hash', async () => {
      const password = 'testPassword123';
      const hash = 'hashedPassword123';

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await service.compareHash(password, hash);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(false);
    });

    it('should handle bcrypt compare errors gracefully', async () => {
      const password = 'testPassword123';
      const hash = 'hashedPassword123';
      const error = new Error('Bcrypt compare error');

      jest.spyOn(bcrypt, 'compare').mockRejectedValue(error as never);

      await expect(service.compareHash(password, hash)).rejects.toThrow(
        'Bcrypt compare error',
      );
    });
  });

  describe('integration tests', () => {
    it('should generate hash and then successfully compare with original password', async () => {
      const password = 'testPassword123';

      // Mock the hash generation
      const mockHash = 'hashedPassword123';
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('testSalt' as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(mockHash as never);

      const generatedHash = await service.generateHash(password);
      expect(generatedHash).toBe(mockHash);

      // Mock the comparison to return true
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const isMatch = await service.compareHash(password, generatedHash);
      expect(isMatch).toBe(true);
    });

    it('should generate hash and fail comparison with wrong password', async () => {
      const correctPassword = 'testPassword123';
      const wrongPassword = 'wrongPassword123';

      // Mock the hash generation
      const mockHash = 'hashedPassword123';
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('testSalt' as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(mockHash as never);

      const generatedHash = await service.generateHash(correctPassword);
      expect(generatedHash).toBe(mockHash);

      // Mock the comparison to return false for wrong password
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const isMatch = await service.compareHash(wrongPassword, generatedHash);
      expect(isMatch).toBe(false);
    });
  });
});

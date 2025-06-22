import { BadRequestException } from '@nestjs/common';
import { IsObjectIdPipe } from './is-object-id.pipe';
import { isValidObjectId } from 'mongoose';

// Mock mongoose isValidObjectId function
jest.mock('mongoose', () => ({
  isValidObjectId: jest.fn(),
}));

describe('IsObjectIdPipe', () => {
  let pipe: IsObjectIdPipe;
  const mockIsValidObjectId = isValidObjectId as jest.MockedFunction<
    typeof isValidObjectId
  >;

  beforeEach(() => {
    pipe = new IsObjectIdPipe();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    it('should return valid ObjectId string', () => {
      const validObjectId = '507f1f77bcf86cd799439011';
      mockIsValidObjectId.mockReturnValue(true);

      const result = pipe.transform(validObjectId);

      expect(mockIsValidObjectId).toHaveBeenCalledWith(validObjectId);
      expect(result).toBe(validObjectId);
    });

    it('should throw BadRequestException for invalid ObjectId', () => {
      const invalidObjectId = 'invalid-object-id';
      mockIsValidObjectId.mockReturnValue(false);

      expect(() => pipe.transform(invalidObjectId)).toThrow(
        new BadRequestException('Invalid ObjectId'),
      );

      expect(mockIsValidObjectId).toHaveBeenCalledWith(invalidObjectId);
    });

    it('should handle empty string', () => {
      const emptyString = '';
      mockIsValidObjectId.mockReturnValue(false);

      expect(() => pipe.transform(emptyString)).toThrow(
        new BadRequestException('Invalid ObjectId'),
      );

      expect(mockIsValidObjectId).toHaveBeenCalledWith(emptyString);
    });

    it('should handle null value', () => {
      const nullValue = null as any;
      mockIsValidObjectId.mockReturnValue(false);

      expect(() => pipe.transform(nullValue)).toThrow(
        new BadRequestException('Invalid ObjectId'),
      );

      expect(mockIsValidObjectId).toHaveBeenCalledWith(nullValue);
    });

    it('should handle undefined value', () => {
      const undefinedValue = undefined as any;
      mockIsValidObjectId.mockReturnValue(false);

      expect(() => pipe.transform(undefinedValue)).toThrow(
        new BadRequestException('Invalid ObjectId'),
      );

      expect(mockIsValidObjectId).toHaveBeenCalledWith(undefinedValue);
    });

    it('should handle number value', () => {
      const numberValue = 123 as any;
      mockIsValidObjectId.mockReturnValue(false);

      expect(() => pipe.transform(numberValue)).toThrow(
        new BadRequestException('Invalid ObjectId'),
      );

      expect(mockIsValidObjectId).toHaveBeenCalledWith(numberValue);
    });

    it('should handle boolean value', () => {
      const booleanValue = true as any;
      mockIsValidObjectId.mockReturnValue(false);

      expect(() => pipe.transform(booleanValue)).toThrow(
        new BadRequestException('Invalid ObjectId'),
      );

      expect(mockIsValidObjectId).toHaveBeenCalledWith(booleanValue);
    });

    it('should handle object value', () => {
      const objectValue = {} as any;
      mockIsValidObjectId.mockReturnValue(false);

      expect(() => pipe.transform(objectValue)).toThrow(
        new BadRequestException('Invalid ObjectId'),
      );

      expect(mockIsValidObjectId).toHaveBeenCalledWith(objectValue);
    });

    it('should handle array value', () => {
      const arrayValue = [] as any;
      mockIsValidObjectId.mockReturnValue(false);

      expect(() => pipe.transform(arrayValue)).toThrow(
        new BadRequestException('Invalid ObjectId'),
      );

      expect(mockIsValidObjectId).toHaveBeenCalledWith(arrayValue);
    });
  });

  describe('edge cases', () => {
    it('should handle very long strings', () => {
      const longString = 'a'.repeat(1000);
      mockIsValidObjectId.mockReturnValue(false);

      expect(() => pipe.transform(longString)).toThrow(
        new BadRequestException('Invalid ObjectId'),
      );

      expect(mockIsValidObjectId).toHaveBeenCalledWith(longString);
    });

    it('should handle strings with special characters', () => {
      const specialCharsString = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      mockIsValidObjectId.mockReturnValue(false);

      expect(() => pipe.transform(specialCharsString)).toThrow(
        new BadRequestException('Invalid ObjectId'),
      );

      expect(mockIsValidObjectId).toHaveBeenCalledWith(specialCharsString);
    });

    it('should handle strings with spaces', () => {
      const stringWithSpaces = ' 507f1f77bcf86cd799439011 ';
      mockIsValidObjectId.mockReturnValue(false);

      expect(() => pipe.transform(stringWithSpaces)).toThrow(
        new BadRequestException('Invalid ObjectId'),
      );

      expect(mockIsValidObjectId).toHaveBeenCalledWith(stringWithSpaces);
    });

    it('should handle strings with newlines', () => {
      const stringWithNewlines = '507f1f77bcf86cd799439011\n';
      mockIsValidObjectId.mockReturnValue(false);

      expect(() => pipe.transform(stringWithNewlines)).toThrow(
        new BadRequestException('Invalid ObjectId'),
      );

      expect(mockIsValidObjectId).toHaveBeenCalledWith(stringWithNewlines);
    });

    it('should handle strings with tabs', () => {
      const stringWithTabs = '507f1f77bcf86cd799439011\t';
      mockIsValidObjectId.mockReturnValue(false);

      expect(() => pipe.transform(stringWithTabs)).toThrow(
        new BadRequestException('Invalid ObjectId'),
      );

      expect(mockIsValidObjectId).toHaveBeenCalledWith(stringWithTabs);
    });

    it('should handle unicode strings', () => {
      const unicodeString = '507f1f77bcf86cd799439011🚀';
      mockIsValidObjectId.mockReturnValue(false);

      expect(() => pipe.transform(unicodeString)).toThrow(
        new BadRequestException('Invalid ObjectId'),
      );

      expect(mockIsValidObjectId).toHaveBeenCalledWith(unicodeString);
    });

    it('should handle strings that look like ObjectIds but are invalid', () => {
      const invalidLookingObjectId = '507f1f77bcf86cd79943901g'; // 'g' is not hex
      mockIsValidObjectId.mockReturnValue(false);

      expect(() => pipe.transform(invalidLookingObjectId)).toThrow(
        new BadRequestException('Invalid ObjectId'),
      );

      expect(mockIsValidObjectId).toHaveBeenCalledWith(invalidLookingObjectId);
    });

    it('should handle strings that are too short', () => {
      const shortString = '507f1f77bcf86cd79943901';
      mockIsValidObjectId.mockReturnValue(false);

      expect(() => pipe.transform(shortString)).toThrow(
        new BadRequestException('Invalid ObjectId'),
      );

      expect(mockIsValidObjectId).toHaveBeenCalledWith(shortString);
    });

    it('should handle strings that are too long', () => {
      const longString = '507f1f77bcf86cd799439011507f1f77bcf86cd799439011';
      mockIsValidObjectId.mockReturnValue(false);

      expect(() => pipe.transform(longString)).toThrow(
        new BadRequestException('Invalid ObjectId'),
      );

      expect(mockIsValidObjectId).toHaveBeenCalledWith(longString);
    });
  });

  describe('valid ObjectId patterns', () => {
    it('should accept standard 24-character hex string', () => {
      const validObjectId = '507f1f77bcf86cd799439011';
      mockIsValidObjectId.mockReturnValue(true);

      const result = pipe.transform(validObjectId);

      expect(mockIsValidObjectId).toHaveBeenCalledWith(validObjectId);
      expect(result).toBe(validObjectId);
    });

    it('should accept ObjectId with all zeros', () => {
      const zeroObjectId = '000000000000000000000000';
      mockIsValidObjectId.mockReturnValue(true);

      const result = pipe.transform(zeroObjectId);

      expect(mockIsValidObjectId).toHaveBeenCalledWith(zeroObjectId);
      expect(result).toBe(zeroObjectId);
    });

    it('should accept ObjectId with all f characters', () => {
      const fObjectId = 'ffffffffffffffffffffffff';
      mockIsValidObjectId.mockReturnValue(true);

      const result = pipe.transform(fObjectId);

      expect(mockIsValidObjectId).toHaveBeenCalledWith(fObjectId);
      expect(result).toBe(fObjectId);
    });

    it('should accept ObjectId with mixed case', () => {
      const mixedCaseObjectId = '507F1F77BCF86CD799439011';
      mockIsValidObjectId.mockReturnValue(true);

      const result = pipe.transform(mixedCaseObjectId);

      expect(mockIsValidObjectId).toHaveBeenCalledWith(mixedCaseObjectId);
      expect(result).toBe(mixedCaseObjectId);
    });
  });

  describe('error handling', () => {
    it('should handle mongoose isValidObjectId throwing an error', () => {
      const testValue = '507f1f77bcf86cd799439011';
      mockIsValidObjectId.mockImplementation(() => {
        throw new Error('Mongoose error');
      });

      expect(() => pipe.transform(testValue)).toThrow('Mongoose error');
    });

    it('should handle mongoose isValidObjectId returning unexpected values', () => {
      const testValue = '507f1f77bcf86cd799439011';
      mockIsValidObjectId.mockReturnValue('unexpected' as any);

      const result = pipe.transform(testValue);

      expect(mockIsValidObjectId).toHaveBeenCalledWith(testValue);
      expect(result).toBe(testValue);
    });
  });

  describe('pipe interface compliance', () => {
    it('should implement PipeTransform interface', () => {
      expect(pipe).toHaveProperty('transform');
      expect(typeof pipe.transform).toBe('function');
    });

    it('should be injectable', () => {
      expect(pipe).toBeInstanceOf(IsObjectIdPipe);
    });
  });
});

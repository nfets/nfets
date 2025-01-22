import { MaxLength } from 'src/domain/decorators/validators/max-length';
import { ValidationError } from 'src/domain/errors/validation-error';

describe('@MaxLength decorator (unit)', () => {
  it('should throw exception when default value exceeds max length', () => {
    expect(() => {
      class Test {
        @MaxLength(2)
        public name = 'world';
      }
      new Test();
    }).toThrow(
      new ValidationError(
        `ValidationError: The length of the "name" property exceeds 2 characters`,
      ),
    );
  });

  it('should throw exception when value exceeds max length', () => {
    class Test {
      @MaxLength(15)
      public name?: string;
    }

    const instance = new Test();
    expect(() => {
      instance.name = '.'.repeat(16);
    }).toThrow(
      new ValidationError(
        `ValidationError: The length of the "name" property exceeds 15 characters`,
      ),
    );
  });

  it("should validate and don't throw exception", () => {
    class Test {
      @MaxLength(5)
      public name = 'world';
    }

    const instance = new Test();
    expect(instance.name).toStrictEqual('world');
  });
});

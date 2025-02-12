import { MaxLength } from 'src/domain/decorators/validators/max-length';
import { ValidationError } from 'src/domain/errors/validation-error';

describe('@MaxLength decorator (unit)', () => {
  it('should throw exception when default value exceeds max length', () => {
    class Test1 {
      @MaxLength(2)
      declare public name: string;
    }

    const instance = new Test1();
    expect(() => {
      instance.name = 'world';
    }).toThrow(
      new ValidationError(
        `ValidationError: The length of the "name" property exceeds 2 characters`,
      ),
    );
  });

  it('should throw exception when value exceeds max length', () => {
    class Test2 {
      @MaxLength(15)
      declare public name?: string;
    }

    const instance = new Test2();
    expect(() => {
      instance.name = '.'.repeat(16);
    }).toThrow(
      new ValidationError(
        `ValidationError: The length of the "name" property exceeds 15 characters`,
      ),
    );
  });

  it("should validate and don't throw exception", () => {
    class Test3 {
      @MaxLength(5)
      declare public name: string;
    }

    const instance = new Test3();
    instance.name = 'world';
    expect(instance.name).toStrictEqual('world');
  });
});

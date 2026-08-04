import { SchemaValidates } from '@nfets/nfe/application/validations/schema';
import { PL_010 } from '@nfets/nfe/domain';

describe('SchemaValidates', () => {
  it('should decorate methods with default schema when none is provided', () => {
    class Target {
      @SchemaValidates()
      public withDefault(): string {
        return 'ok';
      }
    }

    expect(new Target().withDefault()).toBe('ok');
  });

  it('should decorate methods with an explicit schema list', () => {
    class Target {
      @SchemaValidates(PL_010)
      public withPl010(): string {
        return 'pl010';
      }
    }

    expect(new Target().withPl010()).toBe('pl010');
  });
});

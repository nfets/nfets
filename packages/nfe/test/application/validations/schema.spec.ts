import { SchemaValidates } from '@nfets/nfe/application/validations/schema';
import { DefaultSchema, PL_010, type Schema } from '@nfets/nfe/domain';

describe('SchemaValidates', () => {
  it('should run the method when instance schema is in the default list', () => {
    class Target {
      public constructor(public readonly schema: Schema = DefaultSchema) {}

      @SchemaValidates()
      public withDefault(): string {
        return 'ok';
      }
    }

    expect(new Target().withDefault()).toBe('ok');
  });

  it('should run the method when instance schema is in the provided list', () => {
    class Target {
      public constructor(public readonly schema: Schema = 'PL_010_V1.30') {}

      @SchemaValidates(PL_010)
      public withPl010(): string {
        return 'pl010';
      }
    }

    expect(new Target().withPl010()).toBe('pl010');
  });

  it('should skip the method and return this when schema is not in the list', () => {
    class Target {
      public calls = 0;

      public constructor(public readonly schema: Schema = DefaultSchema) {}

      @SchemaValidates(PL_010)
      public withPl010(): string {
        this.calls += 1;
        return 'pl010';
      }
    }

    const target = new Target();

    expect(target.withPl010()).toBe(target);
    expect(target.calls).toBe(0);
  });

  it('should isolate skip behavior per instance schema', () => {
    class Target {
      public calls = 0;

      public constructor(public readonly schema: Schema) {}

      @SchemaValidates(PL_010)
      public withPl010(): this {
        this.calls += 1;
        return this;
      }
    }

    const allowed = new Target('PL_010_V1');
    const blocked = new Target(DefaultSchema);

    expect(allowed.withPl010()).toBe(allowed);
    expect(blocked.withPl010()).toBe(blocked);
    expect(allowed.calls).toBe(1);
    expect(blocked.calls).toBe(0);
  });
});

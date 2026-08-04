import { Once } from '@nfets/core/application/validations/decorators/once';

describe('Once decorator', () => {
  it('should invoke the original method only once per instance', () => {
    class Counter {
      public calls = 0;

      @Once()
      public increment(by = 1): number {
        this.calls += 1;
        return this.calls + by;
      }
    }

    const counter = new Counter();

    expect(counter.increment(10)).toBe(11);
    expect(counter.increment(99)).toBe(11);
    expect(counter.calls).toBe(1);
  });

  it('should keep Once state isolated per instance', () => {
    class Factory {
      public calls = 0;

      @Once()
      public create(): string {
        this.calls += 1;
        return `created-${this.calls}`;
      }
    }

    const first = new Factory();
    const second = new Factory();

    expect(first.create()).toBe('created-1');
    expect(first.create()).toBe('created-1');
    expect(second.create()).toBe('created-1');
    expect(first.calls).toBe(1);
    expect(second.calls).toBe(1);
  });

  it('should no-op when the method descriptor has no value', () => {
    const descriptor: TypedPropertyDescriptor<() => string> = {
      enumerable: true,
      configurable: true,
    };

    expect(() =>
      Once()({}, 'missing', descriptor),
    ).not.toThrow();
    expect(descriptor.value).toBeUndefined();
  });
});

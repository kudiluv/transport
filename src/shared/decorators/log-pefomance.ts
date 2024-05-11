type Options = {
  start: (context: any) => void;
  end: (time: number, context: any) => void;
};

/**
 * A higher-order function that provide speed of resolving function.
 */
export function LogPerfomance(options: Options) {
  return (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>,
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const startTime = performance.now();
      options.start(this);
      const data = await originalMethod.apply(this, args);
      const endTime = performance.now();
      options.end((endTime - startTime) / 1000, this);
      return data;
    };
  };
}

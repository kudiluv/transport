import { Inject } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

/**
 * A higher-order function that adds entity manager to the last argument if it is not provided.
 */
export function Transactional() {
  return (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>,
  ) => {
    Inject(DataSource)(target, 'ds');
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      if (args.at(-1) instanceof EntityManager) {
        return originalMethod.apply(this, args);
      }

      return this.ds.transaction((m) => {
        return originalMethod.apply(this, [...args, m]);
      });
    };
  };
}

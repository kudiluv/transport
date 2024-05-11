import * as compile from 'pbf/compile';
import * as fs from 'fs';
import * as schema from 'protocol-buffers-schema';
// @ts-ignore
import * as Pbf from 'pbf';
import { StreamableFile } from '@nestjs/common';

type Options = {
  path: string;
  schema: (proto: any) => any;
};

/**
 * A higher-order function that transform response to proto.
 */
export function Proto(options: Options) {
  return (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>,
  ) => {
    const originalMethod = descriptor.value;

    const proto = schema.parse(fs.readFileSync(options.path));
    const protoResolver = options.schema(compile(proto));

    descriptor.value = async function (...args: unknown[]) {
      const data = await originalMethod.apply(this, args);
      const pbf = new Pbf();
      protoResolver.write(data, pbf);
      const buffer = pbf.finish();

      return new StreamableFile(buffer);
    };
  };
}

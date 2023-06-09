import { PrismaClient, Prisma } from '.prisma/client';
import { extensionDefinition } from './prisma.extended';

type AllModels = Prisma.TypeMap['meta']['modelProps'];
type WithDeleted<T> = T & { withDeleted?: boolean };

type ExtendedMethods =
  keyof (typeof extensionDefinition)['model']['$allModels'];

type OriginalMethod<K extends string> = K extends `${infer U}Ex` ? U : K;

type ExtensionsTypings = {
  [K in keyof PrismaClientModels]: {
    [U in ExtendedMethods]: (
      args: WithDeleted<
        Parameters<PrismaClientModels[K][OriginalMethod<U>]>[0]
      >,
    ) => ReturnType<PrismaClientModels[K][OriginalMethod<U>]>;
  };
};

type PrismaClientModels = {
  [K in AllModels]: PrismaClient[K];
};

export type PrismaClientEx = PrismaClientModels & ExtensionsTypings;

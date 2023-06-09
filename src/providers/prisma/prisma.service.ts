import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '.prisma/client';
import { extension } from './prisma.extended';
import { PrismaClientEx } from './prisma.extended.types';

export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private static prismaServiceInstance: PrismaService;
  public readonly prismaClient: PrismaClientEx;

  constructor() {
    super();

    this.prismaClient = this.$extends(extension) as unknown as PrismaClientEx;
  }

  static instance(): PrismaService {
    if (!PrismaService.prismaServiceInstance) {
      PrismaService.prismaServiceInstance = new PrismaService();
    }

    return PrismaService.prismaServiceInstance;
  }

  client(): PrismaClientEx {
    return this.prismaClient;
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}

export const prismaProvider = {
  provide: 'PrismaService',
  useFactory: () => new PrismaService(),
};

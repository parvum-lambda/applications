import { Global, Module } from '@nestjs/common';
import { prismaProvider, PrismaService } from './prisma.service';

@Global()
@Module({
  exports: [prismaProvider],
  providers: [prismaProvider],
})
export class PrismaModule {}

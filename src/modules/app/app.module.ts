import { Module } from '@nestjs/common';
import { ApplicationsModule } from '../../http/v1/applications/applications.module';
import { PrismaModule } from '../../providers/prisma/prisma.module';
import { DynamodbModule } from '../../providers/dynamodb/dynamodb.module';
import { KafkaModule } from '../../providers/kafka/kafka.module';
import { ModelBindingModule } from '../model-bindings/model-bindings.module';

@Module({
  imports: [
    ModelBindingModule,
    ApplicationsModule,
    PrismaModule,
    DynamodbModule,
    KafkaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

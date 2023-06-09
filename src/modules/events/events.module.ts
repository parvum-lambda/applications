import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { DynamodbModule } from '../../providers/dynamodb/dynamodb.module';

@Module({
  providers: [EventsService],
  imports: [DynamodbModule],
  exports: [EventsService],
})
export class EventsModule {}

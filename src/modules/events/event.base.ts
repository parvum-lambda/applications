import { IEvent, IEventHandler } from '@nestjs/cqrs';
import { KafkaService } from '../../providers/kafka/kafka.service';

export abstract class EventBase<T extends IEvent> implements IEventHandler<T> {
  protected constructor(private readonly kafkaService: KafkaService) {}
  async handle(event: any): Promise<void> {
    await this.kafkaService.publish(event);
  }
}

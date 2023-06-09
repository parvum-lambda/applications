import { Injectable } from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';
import { BaseData, BaseEvent } from '../../modules/events/struct/base.event';

@Injectable()
export class KafkaService {
  private readonly kafka: Kafka;
  private readonly consumers: Consumer[];
  public constructor() {
    this.kafka = new Kafka({ brokers: process.env.KAFKA_BROKERS.split(',') });
  }

  public async publish<T extends BaseData>(event: BaseEvent<T>) {
    const producer = this.kafka.producer({});
    await producer.connect();
    console.log('event');
    console.log(event);

    await producer.send({
      topic: event.topic,
      messages: [
        {
          headers: {
            topic: event.topic,
          },
          value: JSON.stringify(event.eventData),
        },
      ],
    });
  }
}

import { EventsHandler } from '@nestjs/cqrs';
import {
  ApplicationCreatedEvent,
  CreateApplicationEventPayload,
} from '../struct/application-created.event';
import { ApplicationsService } from '../../applications.service';
import { EventsService } from '../../../../../modules/events/events.service';
import { ApplicationsEventsReducer } from '../applications-events.reducer';
import { BaseEvent } from '../../../../../modules/events/struct/base.event';
import { EventBase } from '../../../../../modules/events/event.base';
import { KafkaService } from '../../../../../providers/kafka/kafka.service';
import { Applications } from '.prisma/client';

@EventsHandler(ApplicationCreatedEvent)
export class ApplicationCreatedEventHandler extends EventBase<ApplicationCreatedEvent> {
  public constructor(
    private readonly eventsService: EventsService,
    private readonly applicationsService: ApplicationsService,
    kafkaService: KafkaService,
  ) {
    super(kafkaService);
  }
  async handle({ event }: ApplicationCreatedEvent): Promise<void> {
    await super.handle(event);

    const { entityId } = event;
    const events = await this.eventsService.getByEntityId<
      BaseEvent<CreateApplicationEventPayload>
    >({ entityId });

    const application = events.reduce(
      ApplicationsEventsReducer.reduce,
      {} as Applications,
    );

    await this.applicationsService.upsertApplication(application);
  }
}

import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ApplicationsService } from '../../applications.service';
import { EventsService } from '../../../../../modules/events/events.service';
import { ApplicationsEventsReducer } from '../applications-events.reducer';
import { BaseEvent } from '../../../../../modules/events/struct/base.event';
import {
  ApplicationUpdatedEvent,
  UpdateApplicationEventPayload,
} from '../struct/application-updated.event';
import { Applications } from '.prisma/client';

@EventsHandler(ApplicationUpdatedEvent)
export class ApplicationUpdatedEventHandler
  implements IEventHandler<ApplicationUpdatedEvent>
{
  public constructor(
    private readonly eventsService: EventsService,
    private readonly applicationsService: ApplicationsService,
  ) {}
  async handle(event: ApplicationUpdatedEvent): Promise<void> {
    const { entityId } = event.event;
    const { lastEventId } =
      (await this.applicationsService.getApplication({
        id: entityId,
      })) || {};

    const events = await this.eventsService.getByEntityId<
      BaseEvent<UpdateApplicationEventPayload>
    >({ entityId, lastEventId });

    const applicationUpdated = events.reduce(
      ApplicationsEventsReducer.reduce,
      {} as Applications,
    );

    await this.applicationsService.upsertApplication(applicationUpdated);
  }
}

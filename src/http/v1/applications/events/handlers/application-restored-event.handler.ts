import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ApplicationsService } from '../../applications.service';
import { EventsService } from '../../../../../modules/events/events.service';
import { ApplicationsEventsReducer } from '../applications-events.reducer';
import { BaseEvent } from '../../../../../modules/events/struct/base.event';
import { ApplicationRestoredEvent } from '../struct/application-restored.event';
import { Applications } from '.prisma/client';

@EventsHandler(ApplicationRestoredEvent)
export class ApplicationRestoredEventHandler
  implements IEventHandler<ApplicationRestoredEvent>
{
  public constructor(
    private readonly eventsService: EventsService,
    private readonly applicationsService: ApplicationsService,
  ) {}
  async handle(event: ApplicationRestoredEvent): Promise<void> {
    const { entityId } = event.event;
    const { lastEventId } =
      (await this.applicationsService.getApplication({ id: entityId })) || {};

    const events = await this.eventsService.getByEntityId<BaseEvent<any>>({
      entityId,
      lastEventId,
    });

    const application = events.reduce(
      ApplicationsEventsReducer.reduce,
      {} as Applications,
    );

    await this.applicationsService.upsertApplication(application);
  }
}

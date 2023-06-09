import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { TOPICS } from '../../../../../modules/events/struct/base.event';
import { EventsService } from '../../../../../modules/events/events.service';
import { RestoreApplicationCommand } from '../structs/restore-application.command';
import {
  ApplicationRestoredEvent,
  ApplicationRestoredEventStruct,
} from '../../events/struct/application-restored.event';

@CommandHandler(RestoreApplicationCommand)
export class RestoreApplicationHandler
  implements ICommandHandler<RestoreApplicationCommand>
{
  public constructor(
    private readonly eventBus: EventBus,
    private readonly eventsService: EventsService,
  ) {}

  async execute({
    application: { id },
  }: RestoreApplicationCommand): Promise<any> {
    const eventPersisted =
      await this.eventsService.persist<ApplicationRestoredEventStruct>({
        topic: TOPICS.APPLICATION_RESTORED,
        entityId: id,
        eventData: {
          id,
        },
      });

    await this.eventBus.publish(new ApplicationRestoredEvent(eventPersisted));

    return {
      id,
    };
  }
}

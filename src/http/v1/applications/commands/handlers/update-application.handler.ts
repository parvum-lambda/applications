import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { EventsService } from '../../../../../modules/events/events.service';
import { TOPICS } from '../../../../../modules/events/struct/base.event';
import { UpdateApplicationCommand } from '../structs/update-application.command';
import {
  ApplicationUpdatedEvent,
  ApplicationUpdatedEventStruct,
} from '../../events/struct/application-updated.event';

@CommandHandler(UpdateApplicationCommand)
export class UpdateApplicationHandler
  implements ICommandHandler<UpdateApplicationCommand, { id: string }>
{
  public constructor(
    private readonly eventBus: EventBus,
    private readonly eventsService: EventsService,
  ) {}
  async execute({
    application: { id },
    name,
  }: UpdateApplicationCommand): Promise<{ id: string }> {
    const eventPersisted =
      await this.eventsService.persist<ApplicationUpdatedEventStruct>({
        topic: TOPICS.APPLICATION_UPDATED,
        entityId: id,
        eventData: {
          id,
          name,
          ...EventsService.updatedAt(),
        },
      });

    await this.eventBus.publish(new ApplicationUpdatedEvent(eventPersisted));

    return {
      id,
    };
  }
}

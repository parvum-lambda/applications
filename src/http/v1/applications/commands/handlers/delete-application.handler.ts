import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { TOPICS } from '../../../../../modules/events/struct/base.event';
import { EventsService } from '../../../../../modules/events/events.service';
import {
  ApplicationDeletedEvent,
  ApplicationDeletedEventStruct,
} from '../../events/struct/application-deleted.event';
import { DeleteApplicationCommand } from '../structs/delete-application.command';

@CommandHandler(DeleteApplicationCommand)
export class DeleteApplicationHandler
  implements ICommandHandler<DeleteApplicationCommand>
{
  public constructor(
    private readonly eventBus: EventBus,
    private readonly eventsService: EventsService,
  ) {}

  async execute({
    application: { id },
  }: DeleteApplicationCommand): Promise<any> {
    const eventPersisted =
      await this.eventsService.persist<ApplicationDeletedEventStruct>({
        topic: TOPICS.APPLICATION_DELETED,
        entityId: id,
        eventData: {
          id,
          ...EventsService.deletedAt(),
        },
      });

    await this.eventBus.publish(new ApplicationDeletedEvent(eventPersisted));

    return {
      id,
    };
  }
}

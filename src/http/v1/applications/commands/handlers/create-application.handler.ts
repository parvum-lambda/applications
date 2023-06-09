import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateApplicationCommand } from '../structs/create-application.command';
import { EventsService } from '../../../../../modules/events/events.service';
import { ApplicationsService } from '../../applications.service';
import {
  ApplicationCreatedEvent,
  ApplicationCreatedEventStruct,
} from '../../events/struct/application-created.event';
import { TOPICS } from '../../../../../modules/events/struct/base.event';

@CommandHandler(CreateApplicationCommand)
export class CreateApplicationHandler
  implements ICommandHandler<CreateApplicationCommand, { id: string }>
{
  public constructor(
    private readonly eventBus: EventBus,
    private readonly eventsService: EventsService,
    private readonly applicationsService: ApplicationsService,
  ) {}
  async execute(command: CreateApplicationCommand): Promise<{ id: string }> {
    const { id } = await this.applicationsService.createApplicationIdentifier(
      {},
    );
    const data = {
      topic: TOPICS.APPLICATION_CREATED,
      entityId: id,
      eventData: {
        id,
        name: command.name,
        appId: ApplicationsService.generateAppId({ id }),
        appKey: ApplicationsService.generateAppKey(),
        ...EventsService.timestamps(),
      },
    };

    const eventPersisted =
      await this.eventsService.persist<ApplicationCreatedEventStruct>(data);

    await this.eventBus.publish(new ApplicationCreatedEvent(eventPersisted));

    return {
      id,
    };
  }
}

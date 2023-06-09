import { BaseEvent } from '../../../../../modules/events/struct/base.event';
import { IEvent } from '@nestjs/cqrs';
import { Applications } from '.prisma/client';

export type UpdateApplicationEventPayload = Pick<
  Applications,
  'id' | 'name' | 'updatedAt'
>;

export type ApplicationUpdatedEventStruct =
  BaseEvent<UpdateApplicationEventPayload>;

export class ApplicationUpdatedEvent implements IEvent {
  public constructor(public readonly event: ApplicationUpdatedEventStruct) {}
}

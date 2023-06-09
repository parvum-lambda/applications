import { BaseEvent } from '../../../../../modules/events/struct/base.event';
import { IEvent } from '@nestjs/cqrs';
import { Applications } from '.prisma/client';

export type DeleteApplicationEventPayload = Pick<
  Applications,
  'id' | 'deletedAt'
>;

export type ApplicationDeletedEventStruct =
  BaseEvent<DeleteApplicationEventPayload>;

export class ApplicationDeletedEvent implements IEvent {
  public constructor(public readonly event: ApplicationDeletedEventStruct) {}
}

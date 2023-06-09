import { BaseEvent } from '../../../../../modules/events/struct/base.event';
import { IEvent } from '@nestjs/cqrs';
import { Applications } from '.prisma/client';

export type RestoreApplicationEventPayload = Pick<Applications, 'id'>;

export type ApplicationRestoredEventStruct =
  BaseEvent<RestoreApplicationEventPayload>;

export class ApplicationRestoredEvent implements IEvent {
  public constructor(public readonly event: ApplicationRestoredEventStruct) {}
}

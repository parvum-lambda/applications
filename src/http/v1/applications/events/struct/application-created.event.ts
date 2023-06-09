import { BaseEvent } from '../../../../../modules/events/struct/base.event';
import { IEvent } from '@nestjs/cqrs';
import { Applications } from '.prisma/client';

export type CreateApplicationEventPayload = Pick<
  Applications,
  'id' | 'name' | 'appId' | 'appKey' | 'createdAt' | 'updatedAt'
>;

export type ApplicationCreatedEventStruct =
  BaseEvent<CreateApplicationEventPayload>;

export class ApplicationCreatedEvent implements IEvent {
  public constructor(public readonly event: ApplicationCreatedEventStruct) {}
}

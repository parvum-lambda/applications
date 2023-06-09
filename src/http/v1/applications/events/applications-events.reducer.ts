import {
  BaseEvent,
  TOPICS,
} from '../../../../modules/events/struct/base.event';
import { CreateApplicationEventPayload } from './struct/application-created.event';
import { UpdateApplicationEventPayload } from './struct/application-updated.event';
import { DeleteApplicationEventPayload } from './struct/application-deleted.event';
import { RestoreApplicationEventPayload } from './struct/application-restored.event';
import { Applications } from '@prisma/client';

export class ApplicationsEventsReducer {
  public static reduce(
    application: Applications,
    event: BaseEvent<
      | CreateApplicationEventPayload
      | UpdateApplicationEventPayload
      | DeleteApplicationEventPayload
      | RestoreApplicationEventPayload
    >,
  ): Applications {
    const lastEventId = event.id;
    switch (event.topic) {
      case TOPICS.APPLICATION_CREATED: {
        const payload: CreateApplicationEventPayload =
          event.eventData as CreateApplicationEventPayload;

        return {
          ...application,
          ...payload,
          deletedAt: null,
          lastEventId,
          id: event.entityId,
        };
      }

      case TOPICS.APPLICATION_UPDATED: {
        const payload: UpdateApplicationEventPayload =
          event.eventData as UpdateApplicationEventPayload;

        return {
          ...application,
          ...payload,
          lastEventId,
          id: event.entityId,
        };
      }

      case TOPICS.APPLICATION_DELETED: {
        const payload: DeleteApplicationEventPayload =
          event.eventData as DeleteApplicationEventPayload;

        return {
          ...application,
          lastEventId,
          deletedAt: payload.deletedAt,
          id: event.entityId,
        };
      }

      case TOPICS.APPLICATION_RESTORED: {
        return {
          ...application,
          lastEventId,
          deletedAt: null,
          id: event.entityId,
        };
      }

      default:
        return application;
    }
  }
}

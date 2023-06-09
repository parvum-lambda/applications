import { ApplicationCreatedEventHandler } from './application-created-event.handler';
import { ApplicationUpdatedEventHandler } from './application-updated-event.handler';
import { ApplicationDeletedEventHandler } from './application-deleted-event.handler';
import { ApplicationRestoredEventHandler } from './application-restored-event.handler';

export const EventHandlers = [
  ApplicationCreatedEventHandler,
  ApplicationUpdatedEventHandler,
  ApplicationDeletedEventHandler,
  ApplicationRestoredEventHandler,
];

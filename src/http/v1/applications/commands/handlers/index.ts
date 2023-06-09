import { CreateApplicationHandler } from './create-application.handler';
import { UpdateApplicationHandler } from './update-application.handler';
import { DeleteApplicationHandler } from './delete-application.handler';
import { RestoreApplicationHandler } from './restore-application.handler';

export const CommandHandlers = [
  CreateApplicationHandler,
  UpdateApplicationHandler,
  DeleteApplicationHandler,
  RestoreApplicationHandler,
];

import { ICommand } from '@nestjs/cqrs';
import { Applications } from '@prisma/client';

export class RestoreApplicationCommand implements ICommand {
  constructor(public readonly application: Applications) {}
}

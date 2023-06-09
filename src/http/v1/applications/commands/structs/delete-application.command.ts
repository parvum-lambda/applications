import { ICommand } from '@nestjs/cqrs';
import { Applications } from '@prisma/client';

export class DeleteApplicationCommand implements ICommand {
  constructor(public readonly application: Applications) {}
}

import { Applications } from '@prisma/client';
import { ICommand } from '@nestjs/cqrs';

export class UpdateApplicationCommand implements ICommand {
  constructor(
    public readonly application: Applications,
    public readonly name: Applications['name'],
  ) {}
}

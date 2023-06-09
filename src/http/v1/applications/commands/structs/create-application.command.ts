import { Applications } from '@prisma/client';
import { ICommand } from '@nestjs/cqrs';

export class CreateApplicationCommand implements ICommand {
  constructor(public readonly name: Applications['name']) {}
}

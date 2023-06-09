import { Module } from '@nestjs/common';
import { ApplicationsController } from './applications.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { EventsModule } from '../../../modules/events/events.module';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { QueryHandlers } from './queries/handlers';
import { ApplicationsService } from './applications.service';
import { UseModelBindings } from '../../../decorators/model-binding.decorator';

@Module({
  controllers: [ApplicationsController],
  imports: [CqrsModule, EventsModule],
  providers: [
    ApplicationsService,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
  ],
  exports: [...QueryHandlers],
})
@UseModelBindings()
export class ApplicationsModule {}

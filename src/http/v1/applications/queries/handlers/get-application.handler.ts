import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetApplicationsQuery } from '../struct/get-applications.query';
import { ApplicationsService } from '../../applications.service';
import { GetApplicationResponseDto } from '../../dto/get-application-response.dto';
import { NotFoundException } from '@nestjs/common';
import { Flags } from '../../../../../decorators/model-binding.decorator';
import { EventsService } from '../../../../../modules/events/events.service';

@QueryHandler(GetApplicationsQuery)
export class GetApplicationHandler
  implements IQueryHandler<GetApplicationsQuery>
{
  public constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly eventsService: EventsService,
  ) {}

  async execute({
    id,
    flags,
  }: GetApplicationsQuery): Promise<GetApplicationResponseDto> {
    const application =
      (await this.applicationsService.getApplication({
        id,
        withDeleted: !!(flags & Flags.WITH_DELETED),
      })) ||
      (await this.applicationsService.getApplicationFromEvents({
        id,
        withDeleted: !!(flags & Flags.WITH_DELETED),
      }));

    if (!application) {
      throw new NotFoundException();
    }

    return application;
  }
}

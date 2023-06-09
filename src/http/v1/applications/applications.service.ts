import { Inject, Injectable } from '@nestjs/common';
import { Applications, Prisma } from '.prisma/client';
import { PrismaService } from '../../../providers/prisma/prisma.service';
import * as crypto from 'crypto';
import { encrypt, UuidV7 } from 'src/helpers';
import { EventsService } from '../../../modules/events/events.service';
import { BaseEvent } from '../../../modules/events/struct/base.event';
import { ApplicationsEventsReducer } from './events/applications-events.reducer';
import { ApplicationIdentifier } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  public constructor(
    @Inject('PrismaService')
    private readonly prismaService: PrismaService,
    private readonly eventsService: EventsService,
  ) {}

  public async createApplicationIdentifier(args?: {
    id?: ApplicationIdentifier['id'];
  }) {
    const { id } = args || {};
    return await this.prismaService.applicationIdentifier.create({
      data: id
        ? {
            id,
          }
        : {},
    });
  }

  public async getApplication({
    id,
    withDeleted = false,
  }: {
    id: Applications['id'];
    withDeleted?: boolean;
  }): Promise<Applications> {
    console.log({
      where: {
        id,
        ...(withDeleted ? { deletedAt: {} } : {}),
      },
    });
    return await this.prismaService.applications.findUnique({
      where: {
        id,
        ...(withDeleted ? { deletedAt: {} } : {}),
      },
    });
  }

  public async getApplicationFromEvents({
    id,
    withDeleted,
  }: {
    id: Applications['id'];
    withDeleted: boolean;
  }): Promise<Applications> {
    const events = await this.eventsService.getByEntityId<BaseEvent<any>>({
      entityId: id,
    });

    const application = events.reduce(
      ApplicationsEventsReducer.reduce,
      {} as Applications,
    );

    if (application.deletedAt && !withDeleted) {
      return null;
    }

    return application;
  }

  private async checkIdentifier(id: Applications['id']) {
    const identifier =
      await this.prismaService.applicationIdentifier.findUnique({
        where: {
          id,
        },
      });

    if (!identifier) {
      await this.createApplicationIdentifier({ id });
    }
  }

  public async upsertApplication({
    id,
    ...data
  }: Applications): Promise<Applications> {
    await this.checkIdentifier(id);

    const applicationData: Prisma.ApplicationsCreateInput = {
      ...data,
      applicationIdentifier: {
        connect: { id },
      },
    };

    // @
    // await this.prismaService.applications.upsert('a');
    // this.prismaService.applicationIdentifier.upsertEx('b');

    return await this.prismaService.applications.upsert({
      where: {
        id,
      },
      create: applicationData,
      update: applicationData,
    });
  }

  public static generateAppId({ id }: { id: string }): string {
    return encrypt(Buffer.from(UuidV7(id).bytes));
  }

  public static generateAppKey(): string {
    return encrypt(crypto.randomBytes(128));
  }
}

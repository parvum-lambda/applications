import { Injectable } from '@nestjs/common';
import { DynamodbService } from '../../providers/dynamodb/dynamodb.service';
import {
  EVENTS_TABLE_COLUMNS,
  EVENTS_TABLE_COLUMNS_TYPE,
  EVENTS_TABLE_NAME,
  eventsTableDefinition,
} from '../../modules/events/events.table';
import { BaseEvent } from './struct/base.event';
import * as moment from 'moment';
import { UuidV7 } from '../../helpers';
import { entitiesTableDefinition } from './entities.table';

@Injectable()
export class EventsService {
  constructor(private readonly dynamoDBService: DynamodbService) {
    this.dynamoDBService.setupTable(eventsTableDefinition);
    this.dynamoDBService.setupTable(entitiesTableDefinition);
  }

  public async persist<T extends BaseEvent<any>>(data: T): Promise<T> {
    const item = (
      await this.dynamoDBService.updateItem({
        TableName: EVENTS_TABLE_NAME,
        Key: {
          [EVENTS_TABLE_COLUMNS.id]: {
            [EVENTS_TABLE_COLUMNS_TYPE[EVENTS_TABLE_COLUMNS.id]]: Buffer.from(
              UuidV7().bytes,
            ),
          },
          [EVENTS_TABLE_COLUMNS.entityId]: {
            [EVENTS_TABLE_COLUMNS_TYPE[EVENTS_TABLE_COLUMNS.entityId]]: UuidV7(
              data.eventData.id,
            ).bytes,
          },
        },
        UpdateExpression: `SET
          ${EVENTS_TABLE_COLUMNS.topic}=:${EVENTS_TABLE_COLUMNS.topic},
          ${EVENTS_TABLE_COLUMNS.eventData}=:${EVENTS_TABLE_COLUMNS.eventData},
          ${EVENTS_TABLE_COLUMNS.createdAt}=:${EVENTS_TABLE_COLUMNS.createdAt}
        `,
        ExpressionAttributeValues: {
          [`:${EVENTS_TABLE_COLUMNS.topic}`]: {
            [EVENTS_TABLE_COLUMNS_TYPE[EVENTS_TABLE_COLUMNS.topic]]: data.topic,
          },
          [`:${EVENTS_TABLE_COLUMNS.eventData}`]: {
            [EVENTS_TABLE_COLUMNS_TYPE[EVENTS_TABLE_COLUMNS.eventData]]:
              JSON.stringify(data.eventData),
          },
          [`:${EVENTS_TABLE_COLUMNS.createdAt}`]: {
            [EVENTS_TABLE_COLUMNS_TYPE[EVENTS_TABLE_COLUMNS.createdAt]]:
              moment().unix().toString(),
          },
        },
        ReturnValues: 'ALL_NEW',
      })
    ).Attributes;

    return EventsService.transformData(DynamodbService.sanitizeItem<T>(item));
  }

  public async getByEntityId<T extends BaseEvent<any>>({
    entityId,
    lastEventId,
  }: {
    entityId: string | Buffer;
    lastEventId?: string | Buffer;
  }): Promise<T[]> {
    const bufferEntityId =
      typeof entityId === 'string' ? UuidV7(entityId).bytes : entityId;
    const bufferLastEventId =
      typeof lastEventId === 'string' ? UuidV7(lastEventId).bytes : lastEventId;

    const items = (
      await this.dynamoDBService.query({
        TableName: EVENTS_TABLE_NAME,
        KeyConditions: {
          [EVENTS_TABLE_COLUMNS.entityId]: {
            AttributeValueList: [
              {
                B: bufferEntityId,
              },
            ],
            ComparisonOperator: 'EQ',
          },
          ...(bufferLastEventId
            ? {
                [EVENTS_TABLE_COLUMNS.id]: {
                  AttributeValueList: [
                    {
                      B: bufferLastEventId,
                    },
                  ],
                  ComparisonOperator: 'GT',
                },
              }
            : {}),
        },
      })
    ).Items;
    const sanitizedItems = items.map<T>(DynamodbService.sanitizeItem);

    return sanitizedItems.map(EventsService.transformData);
  }

  private getAllEntityIds() {
    this.dynamoDBService.scan({
      TableName: EVENTS_TABLE_NAME,
    });
  }

  private static transformData<T>(item: T): T {
    return {
      ...item,
      id: UuidV7(item[EVENTS_TABLE_COLUMNS.id]).toString(),
      entityId: UuidV7(item[EVENTS_TABLE_COLUMNS.entityId]).toString(),
      [EVENTS_TABLE_COLUMNS.eventData]: JSON.parse(
        item[EVENTS_TABLE_COLUMNS.eventData],
      ),
    };
  }

  public static timestamps(): { createdAt: Date; updatedAt: Date } {
    return {
      createdAt: moment().toDate(),
      ...EventsService.updatedAt(),
    };
  }

  public static updatedAt(): { updatedAt: Date } {
    return {
      updatedAt: moment().toDate(),
    };
  }

  public static deletedAt(): { deletedAt: Date } {
    return {
      deletedAt: moment().toDate(),
    };
  }
}

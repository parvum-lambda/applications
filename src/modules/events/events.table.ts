import {
  ColMapping,
  KEY_TYPES,
} from '../../providers/dynamodb/dynamodb.contants';

const EVENTS_TABLE_NAME = 'events';
enum EVENTS_TABLE_COLUMNS {
  id = 'id',
  entityId = 'entityId',
  topic = 'topic',
  eventData = 'eventData',
  createdAt = 'createdAt',
}

export const EVENTS_TABLE_COLUMNS_TYPE: ColMapping<
  typeof EVENTS_TABLE_COLUMNS
> = {
  id: 'B',
  entityId: 'B',
  topic: 'S',
  eventData: 'S',
  createdAt: 'N',
};

const eventsTableDefinition = {
  TableName: EVENTS_TABLE_NAME,
  AttributeDefinitions: [
    {
      AttributeName: EVENTS_TABLE_COLUMNS.entityId,
      AttributeType: EVENTS_TABLE_COLUMNS_TYPE[EVENTS_TABLE_COLUMNS.entityId],
    },
    {
      AttributeName: EVENTS_TABLE_COLUMNS.id,
      AttributeType: EVENTS_TABLE_COLUMNS_TYPE[EVENTS_TABLE_COLUMNS.id],
    },
  ],
  KeySchema: [
    {
      AttributeName: EVENTS_TABLE_COLUMNS.entityId,
      KeyType: KEY_TYPES.PRIMARY_KEY,
    },
    {
      AttributeName: EVENTS_TABLE_COLUMNS.id,
      KeyType: KEY_TYPES.SORT_KEY,
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 3,
    WriteCapacityUnits: 3,
  },
  StreamSpecification: {
    StreamEnabled: false,
  },
};

export { EVENTS_TABLE_NAME, EVENTS_TABLE_COLUMNS, eventsTableDefinition };

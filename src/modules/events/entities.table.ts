import {
  ColMapping,
  KEY_TYPES,
} from '../../providers/dynamodb/dynamodb.contants';

const ENTITIES_TABLE_NAME = 'entities';
enum ENTITIES_TABLE_COLUMNS {
  entityId = 'entityId',
}

export const ENTITIES_TABLE_COLUMNS_TYPE: ColMapping<
  typeof ENTITIES_TABLE_COLUMNS
> = {
  entityId: 'B',
};

const entitiesTableDefinition = {
  TableName: ENTITIES_TABLE_NAME,
  AttributeDefinitions: [
    {
      AttributeName: ENTITIES_TABLE_COLUMNS.entityId,
      AttributeType:
        ENTITIES_TABLE_COLUMNS_TYPE[ENTITIES_TABLE_COLUMNS.entityId],
    },
  ],
  KeySchema: [
    {
      AttributeName: ENTITIES_TABLE_COLUMNS.entityId,
      KeyType: KEY_TYPES.PRIMARY_KEY,
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

export { ENTITIES_TABLE_NAME, ENTITIES_TABLE_COLUMNS, entitiesTableDefinition };

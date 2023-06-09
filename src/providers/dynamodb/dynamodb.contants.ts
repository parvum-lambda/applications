import {
  AttributeMap,
  BinaryAttributeValue,
  BinarySetAttributeValue,
  BooleanAttributeValue,
  MapAttributeValue,
  NullAttributeValue,
  NumberAttributeValue,
  NumberSetAttributeValue,
  StringAttributeValue,
  StringSetAttributeValue,
} from 'aws-sdk/clients/dynamodb';

export type DataTypes =
  | AttributeMap
  | StringAttributeValue
  | StringSetAttributeValue
  | NumberAttributeValue
  | NumberSetAttributeValue
  | BinaryAttributeValue
  | BinarySetAttributeValue
  | MapAttributeValue
  | BooleanAttributeValue
  | NullAttributeValue;

type ColTypes =
  | 'S'
  | 'B'
  | 'N'
  | 'SS'
  | 'NS'
  | 'BS'
  | 'M'
  | 'L'
  | 'NULL'
  | 'BOOL';

export type ColMapping<T> = {
  [k in keyof T]: ColTypes;
};

export enum KEY_TYPES {
  PRIMARY_KEY = 'HASH',
  SORT_KEY = 'RANGE',
}

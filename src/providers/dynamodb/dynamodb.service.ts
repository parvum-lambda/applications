import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { promisify } from '../../helpers';
import { ColMapping, DataTypes } from './dynamodb.contants';
import { WaiterConfiguration } from 'aws-sdk/lib/service';
import {
  AttributeMap,
  NumberSetAttributeValue,
  TableNameList,
} from 'aws-sdk/clients/dynamodb';

@Injectable()
export class DynamodbService {
  private readonly dynamoDB: AWS.DynamoDB;
  private readonly tableDefinitions = [];
  private tables: TableNameList | null = null;

  public constructor() {
    AWS.config.accessKeyId = process.env.AWS_ACESS_KEY_ID;
    AWS.config.secretAccessKey = process.env.AWS_SECRET_ACESS_KEY;

    this.dynamoDB = new AWS.DynamoDB({
      endpoint: process.env.DYNAMODB_ENDPOINT,
      apiVersion: process.env.AWS_SDK_VERSION,
      region: 'us-west-2',
    });

    this.init();
  }

  private async init() {
    this.tables = (await this.listTables({})).TableNames;

    this.tableDefinitions.forEach((tableDefinition) => {
      this.setupTable(tableDefinition);
    });
  }

  public setupTable(tableDefinition) {
    if (!this.tables) {
      this.tableDefinitions.push(tableDefinition);

      return;
    }

    if (this.tables.includes(tableDefinition.TableName)) {
      return;
    }

    console.log(`Creating ${tableDefinition.TableName} table.`);

    return this.createTable(tableDefinition);
  }

  public static sanitizeItem<T>(item: AttributeMap): T {
    const finalItem = {};

    for (const col of Object.keys(item)) {
      const colType = Object.keys(item[col])[0];
      const rawValue = item[col][colType] as DataTypes;
      const attrName = col as ColMapping<T>;

      switch (colType) {
        case 'S':
          finalItem[attrName as string] = rawValue;
          break;

        case 'SS':
          finalItem[attrName as string] = rawValue;
          break;

        case 'N':
          finalItem[attrName as string] = parseInt(rawValue as string);
          break;

        case 'NS':
          finalItem[attrName as string] = (
            rawValue as NumberSetAttributeValue
          ).map((val) => parseInt(val));
          break;

        case 'B':
          finalItem[attrName as string] = rawValue;
          break;

        case 'BS':
          finalItem[attrName as string] = rawValue;
          break;

        case 'M':
          finalItem[attrName as string] = this.sanitizeItem(
            rawValue as AttributeMap,
          );
          break;

        case 'BOOL':
          finalItem[attrName as string] = rawValue;
          break;

        case 'NULL':
          finalItem[attrName as string] = rawValue as unknown as boolean;
          break;
      }
    }

    return finalItem as T;
  }

  batchExecuteStatement(
    params: AWS.DynamoDB.Types.BatchExecuteStatementInput,
  ): Promise<AWS.DynamoDB.Types.BatchExecuteStatementOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.batchExecuteStatement,
      params,
    );
  }

  batchGetItem(
    params: AWS.DynamoDB.Types.BatchGetItemInput,
  ): Promise<AWS.DynamoDB.Types.BatchGetItemOutput> {
    return promisify.call(this.dynamoDB, this.dynamoDB.batchGetItem, params);
  }

  batchWriteItem(
    params: AWS.DynamoDB.Types.BatchWriteItemInput,
  ): Promise<AWS.DynamoDB.Types.BatchWriteItemOutput> {
    return promisify.call(this.dynamoDB, this.dynamoDB.batchWriteItem, params);
  }

  createBackup(
    params: AWS.DynamoDB.Types.CreateBackupInput,
  ): Promise<AWS.DynamoDB.Types.CreateBackupOutput> {
    return promisify.call(this.dynamoDB, this.dynamoDB.createBackup, params);
  }

  createGlobalTable(
    params: AWS.DynamoDB.Types.CreateGlobalTableInput,
  ): Promise<AWS.DynamoDB.Types.CreateGlobalTableOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.createGlobalTable,
      params,
    );
  }

  createTable(
    params: AWS.DynamoDB.Types.CreateTableInput,
  ): Promise<AWS.DynamoDB.Types.CreateTableOutput> {
    return promisify.call(this.dynamoDB, this.dynamoDB.createTable, params);
  }

  deleteBackup(
    params: AWS.DynamoDB.Types.DeleteBackupInput,
  ): Promise<AWS.DynamoDB.Types.DeleteBackupOutput> {
    return promisify.call(this.dynamoDB, this.dynamoDB.deleteBackup, params);
  }

  deleteItem(
    params: AWS.DynamoDB.Types.DeleteItemInput,
  ): Promise<AWS.DynamoDB.Types.DeleteItemOutput> {
    return promisify.call(this.dynamoDB, this.dynamoDB.deleteItem, params);
  }

  deleteTable(
    params: AWS.DynamoDB.Types.DeleteTableInput,
  ): Promise<AWS.DynamoDB.Types.DeleteTableOutput> {
    return promisify.call(this.dynamoDB, this.dynamoDB.deleteTable, params);
  }

  describeBackup(
    params: AWS.DynamoDB.Types.DescribeBackupInput,
  ): Promise<AWS.DynamoDB.Types.DescribeBackupOutput> {
    return promisify.call(this.dynamoDB, this.dynamoDB.describeBackup, params);
  }

  describeContinuousBackups(
    params: AWS.DynamoDB.Types.DescribeContinuousBackupsInput,
  ): Promise<AWS.DynamoDB.Types.DescribeContinuousBackupsOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.describeContinuousBackups,
      params,
    );
  }

  describeContributorInsights(
    params: AWS.DynamoDB.Types.DescribeContributorInsightsInput,
  ): Promise<AWS.DynamoDB.Types.DescribeContributorInsightsOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.describeContributorInsights,
      params,
    );
  }

  describeEndpoints(
    params: AWS.DynamoDB.Types.DescribeEndpointsRequest,
  ): Promise<AWS.DynamoDB.Types.DescribeEndpointsResponse> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.describeEndpoints,
      params,
    );
  }

  describeExport(
    params: AWS.DynamoDB.Types.DescribeExportInput,
  ): Promise<AWS.DynamoDB.Types.DescribeExportOutput> {
    return promisify.call(this.dynamoDB, this.dynamoDB.describeExport, params);
  }

  describeGlobalTable(
    params: AWS.DynamoDB.Types.DescribeGlobalTableInput,
  ): Promise<AWS.DynamoDB.Types.DescribeGlobalTableOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.describeGlobalTable,
      params,
    );
  }

  describeGlobalTableSettings(
    params: AWS.DynamoDB.Types.DescribeGlobalTableSettingsInput,
  ): Promise<AWS.DynamoDB.Types.DescribeGlobalTableSettingsOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.describeGlobalTableSettings,
      params,
    );
  }

  describeImport(
    params: AWS.DynamoDB.Types.DescribeImportInput,
  ): Promise<AWS.DynamoDB.Types.DescribeImportOutput> {
    return promisify.call(this.dynamoDB, this.dynamoDB.describeImport, params);
  }

  describeKinesisStreamingDestination(
    params: AWS.DynamoDB.Types.DescribeKinesisStreamingDestinationInput,
  ): Promise<AWS.DynamoDB.Types.DescribeKinesisStreamingDestinationOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.describeKinesisStreamingDestination,
      params,
    );
  }

  describeLimits(
    params: AWS.DynamoDB.Types.DescribeLimitsInput,
  ): Promise<AWS.DynamoDB.Types.DescribeLimitsOutput> {
    return promisify.call(this.dynamoDB, this.dynamoDB.describeLimits, params);
  }

  describeTable(
    params: AWS.DynamoDB.Types.DescribeTableInput,
  ): Promise<AWS.DynamoDB.Types.DescribeTableOutput> {
    return promisify.call(this.dynamoDB, this.dynamoDB.describeTable, params);
  }

  describeTableReplicaAutoScaling(
    params: AWS.DynamoDB.Types.DescribeTableReplicaAutoScalingInput,
  ): Promise<AWS.DynamoDB.Types.DescribeTableReplicaAutoScalingOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.describeTableReplicaAutoScaling,
      params,
    );
  }

  describeTimeToLive(
    params: AWS.DynamoDB.Types.DescribeTimeToLiveInput,
  ): Promise<AWS.DynamoDB.Types.DescribeTimeToLiveOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.describeTimeToLive,
      params,
    );
  }

  disableKinesisStreamingDestination(
    params: AWS.DynamoDB.Types.KinesisStreamingDestinationInput,
  ): Promise<AWS.DynamoDB.Types.KinesisStreamingDestinationOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.disableKinesisStreamingDestination,
      params,
    );
  }

  enableKinesisStreamingDestination(
    params: AWS.DynamoDB.Types.KinesisStreamingDestinationInput,
  ): Promise<AWS.DynamoDB.Types.KinesisStreamingDestinationOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.enableKinesisStreamingDestination,
      params,
    );
  }

  executeStatement(
    params: AWS.DynamoDB.Types.ExecuteStatementInput,
  ): Promise<AWS.DynamoDB.Types.ExecuteStatementOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.executeStatement,
      params,
    );
  }

  executeTransaction(
    params: AWS.DynamoDB.Types.ExecuteTransactionInput,
  ): Promise<AWS.DynamoDB.Types.ExecuteTransactionOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.executeTransaction,
      params,
    );
  }

  exportTableToPointInTime(
    params: AWS.DynamoDB.Types.ExportTableToPointInTimeInput,
  ): Promise<AWS.DynamoDB.Types.ExportTableToPointInTimeOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.exportTableToPointInTime,
      params,
    );
  }

  getItem(
    params: AWS.DynamoDB.Types.GetItemInput,
  ): Promise<AWS.DynamoDB.Types.GetItemOutput> {
    return promisify.call(this.dynamoDB, this.dynamoDB.getItem, params);
  }

  importTable(
    params: AWS.DynamoDB.Types.ImportTableInput,
  ): Promise<AWS.DynamoDB.Types.ImportTableOutput> {
    return promisify.call(this.dynamoDB, this.dynamoDB.importTable, params);
  }

  listBackups(
    params: AWS.DynamoDB.Types.ListBackupsInput,
  ): Promise<AWS.DynamoDB.Types.ListBackupsOutput> {
    return promisify.call(this.dynamoDB, this.dynamoDB.listBackups, params);
  }

  listContributorInsights(
    params: AWS.DynamoDB.Types.ListContributorInsightsInput,
  ): Promise<AWS.DynamoDB.Types.ListContributorInsightsOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.listContributorInsights,
      params,
    );
  }

  listExports(
    params: AWS.DynamoDB.Types.ListExportsInput,
  ): Promise<AWS.DynamoDB.Types.ListExportsOutput> {
    return promisify.call(this.dynamoDB, this.dynamoDB.listExports, params);
  }

  listGlobalTables(
    params: AWS.DynamoDB.Types.ListGlobalTablesInput,
  ): Promise<AWS.DynamoDB.Types.ListGlobalTablesOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.listGlobalTables,
      params,
    );
  }

  listImports(
    params: AWS.DynamoDB.Types.ListImportsInput,
  ): Promise<AWS.DynamoDB.Types.ListImportsOutput> {
    return promisify.call(this.dynamoDB, this.dynamoDB.listImports, params);
  }

  listTables(
    params: AWS.DynamoDB.Types.ListTablesInput,
  ): Promise<AWS.DynamoDB.Types.ListTablesOutput> {
    return promisify.call(this.dynamoDB, this.dynamoDB.listTables, params);
  }

  listTagsOfResource(
    params: AWS.DynamoDB.Types.ListTagsOfResourceInput,
  ): Promise<AWS.DynamoDB.Types.ListTagsOfResourceOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.listTagsOfResource,
      params,
    );
  }

  putItem(
    params: AWS.DynamoDB.Types.PutItemInput,
  ): Promise<AWS.DynamoDB.Types.PutItemOutput> {
    return promisify.call(this.dynamoDB, this.dynamoDB.putItem, params);
  }

  query(
    params: AWS.DynamoDB.Types.QueryInput,
  ): Promise<AWS.DynamoDB.Types.QueryOutput> {
    return promisify.call(this.dynamoDB, this.dynamoDB.query, params);
  }

  restoreTableFromBackup(
    params: AWS.DynamoDB.Types.RestoreTableFromBackupInput,
  ): Promise<AWS.DynamoDB.Types.RestoreTableFromBackupOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.restoreTableFromBackup,
      params,
    );
  }

  restoreTableToPointInTime(
    params: AWS.DynamoDB.Types.RestoreTableToPointInTimeInput,
  ): Promise<AWS.DynamoDB.Types.RestoreTableToPointInTimeOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.restoreTableToPointInTime,
      params,
    );
  }

  scan(
    params: AWS.DynamoDB.Types.ScanInput,
  ): Promise<AWS.DynamoDB.Types.ScanOutput> {
    return promisify.call(this.dynamoDB, this.dynamoDB.scan, params);
  }

  tagResource(params: AWS.DynamoDB.Types.TagResourceInput): Promise<never> {
    return promisify.call(this.dynamoDB, this.dynamoDB.tagResource, params);
  }

  transactGetItems(
    params: AWS.DynamoDB.Types.TransactGetItemsInput,
  ): Promise<AWS.DynamoDB.Types.TransactGetItemsOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.transactGetItems,
      params,
    );
  }

  transactWriteItems(
    params: AWS.DynamoDB.Types.TransactWriteItemsInput,
  ): Promise<AWS.DynamoDB.Types.TransactWriteItemsOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.transactWriteItems,
      params,
    );
  }

  untagResource(params: AWS.DynamoDB.Types.UntagResourceInput): Promise<never> {
    return promisify.call(this.dynamoDB, this.dynamoDB.untagResource, params);
  }

  updateContinuousBackups(
    params: AWS.DynamoDB.Types.UpdateContinuousBackupsInput,
  ): Promise<AWS.DynamoDB.Types.UpdateContinuousBackupsOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.updateContinuousBackups,
      params,
    );
  }

  updateContributorInsights(
    params: AWS.DynamoDB.Types.UpdateContributorInsightsInput,
  ): Promise<AWS.DynamoDB.Types.UpdateContributorInsightsOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.updateContributorInsights,
      params,
    );
  }

  updateGlobalTable(
    params: AWS.DynamoDB.Types.UpdateGlobalTableInput,
  ): Promise<AWS.DynamoDB.Types.UpdateGlobalTableOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.updateGlobalTable,
      params,
    );
  }

  updateGlobalTableSettings(
    params: AWS.DynamoDB.Types.UpdateGlobalTableSettingsInput,
  ): Promise<AWS.DynamoDB.Types.UpdateGlobalTableSettingsOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.updateGlobalTableSettings,
      params,
    );
  }

  updateItem(
    params: AWS.DynamoDB.Types.UpdateItemInput,
  ): Promise<AWS.DynamoDB.Types.UpdateItemOutput> {
    return promisify.call(this.dynamoDB, this.dynamoDB.updateItem, params);
  }

  updateTable(
    params: AWS.DynamoDB.Types.UpdateTableInput,
  ): Promise<AWS.DynamoDB.Types.UpdateTableOutput> {
    return promisify.call(this.dynamoDB, this.dynamoDB.updateTable, params);
  }

  updateTableReplicaAutoScaling(
    params: AWS.DynamoDB.Types.UpdateTableReplicaAutoScalingInput,
  ): Promise<AWS.DynamoDB.Types.UpdateTableReplicaAutoScalingOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.updateTableReplicaAutoScaling,
      params,
    );
  }

  updateTimeToLive(
    params: AWS.DynamoDB.Types.UpdateTimeToLiveInput,
  ): Promise<AWS.DynamoDB.Types.UpdateTimeToLiveOutput> {
    return promisify.call(
      this.dynamoDB,
      this.dynamoDB.updateTimeToLive,
      params,
    );
  }

  waitFor(
    state: 'tableExists' | 'tableNotExists',
    params: AWS.DynamoDB.Types.DescribeTableInput & {
      $waiter?: WaiterConfiguration;
    },
  ): Promise<AWS.DynamoDB.Types.DescribeTableOutput> {
    return promisify.call(this.dynamoDB, this.dynamoDB.waitFor, state, params);
  }
}

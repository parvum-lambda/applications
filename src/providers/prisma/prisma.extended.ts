import { Prisma } from '.prisma/client';
import * as moment from 'moment/moment';

const DELETED_AT_COLUMN = 'deletedAt';

export const extensionDefinition = {
  model: {
    $allModels: {
      findUniqueEx(args) {
        const context = Prisma.getExtensionContext(this);

        return queryWithSoftDelete(context, context.findFirst, args);
      },
      findUniqueOrThrowEx(args) {
        const context = Prisma.getExtensionContext(this);

        return queryWithSoftDelete(context, context.findUnique, args);
      },
      findFirstEx(args) {
        const context = Prisma.getExtensionContext(this);

        return queryWithSoftDelete(context, context.findFirst, args);
      },
      findFirstOrThrowEx(args) {
        const context = Prisma.getExtensionContext(this);

        return queryWithSoftDelete(context, context.findFirst, args);
      },
      findManyEx(args) {
        const context = Prisma.getExtensionContext(this);

        return queryWithSoftDelete(context, context.findMany, args);
      },
      deleteEx(args) {
        const context = Prisma.getExtensionContext(this);

        const deletedAt = getDataModel(context.name).fields.find(
          (field) => field.name === DELETED_AT_COLUMN,
        );

        if (!deletedAt) {
          return context.delete(args);
        }

        const { where } = args;

        return context.update({
          where,
          data: {
            updatedAt: moment().toDate(),
          },
        });
      },
      deleteManyEx(args) {
        const context = Prisma.getExtensionContext(this);

        const deletedAt = getDataModel(context.name).fields.find(
          (field) => field.name === DELETED_AT_COLUMN,
        );

        if (!deletedAt) {
          return context.deleteMany(args);
        }

        const { where } = args;

        return context.updateMany({
          where,
          data: {
            updatedAt: moment().toDate(),
          },
        });
      },
      updateEx(args) {
        const context = Prisma.getExtensionContext(this);

        return queryWithSoftDelete(context, context.update, args);
      },
      updateManyEx(args) {
        const context = Prisma.getExtensionContext(this);

        return queryWithSoftDelete(context, context.updateMany, args);
      },
      upsertEx(args) {
        const context = Prisma.getExtensionContext(this);

        return queryWithSoftDelete(context, context.upsert, args);
      },
      countEx(args) {
        const context = Prisma.getExtensionContext(this);

        return queryWithSoftDelete(context, context.count, args);
      },
      aggregateEx(args) {
        const context = Prisma.getExtensionContext(this);

        return queryWithSoftDelete(context, context.aggregate, args);
      },
    },
  },
};

export const extension = Prisma.defineExtension(extensionDefinition);

function getDataModel(modelName: string) {
  return Prisma.dmmf.datamodel.models.find(
    (dataModel) => dataModel.name === modelName,
  );
}

function queryWithSoftDelete(
  context,
  originalFn,
  { withDeleted, ...args },
): Promise<any> {
  if (withDeleted) {
    return originalFn(args);
  }
  const deletedAt = getDataModel(context.name).fields.find(
    (field) => field.name === DELETED_AT_COLUMN,
  );

  if (!deletedAt) {
    return originalFn(args);
  }

  if (!args.where.and) {
    args.where = {};
  }

  args.where.deletedAt = null;

  return originalFn(args);
}

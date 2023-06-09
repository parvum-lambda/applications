import { Prisma } from '.prisma/client';
import * as runtime from '@prisma/client/runtime/library';

const DELETED_AT_COLUMN = 'deletedAt';

export const softDeleteExtension = Prisma.defineExtension({
  model: {
    $allModels: {
      // async upsertEx(id: string) {
      //   Prisma.getExtensionContext(this).Attributes;
      //   console.log('fields:', JSON.stringify(Prisma.dmmf.datamodel.models));
      // },

      async findFirstEx({ withDeleted, ...args }) {
        if (withDeleted) {
          return Prisma.getExtensionContext(this).findFirst(args);
        }

        const context = Prisma.getExtensionContext(this);
        const deletedAt = getDataModel(context.name).fields.find(
          (field) => field.name === DELETED_AT_COLUMN,
        );

        if (!deletedAt) {
          return Prisma.getExtensionContext(this).findFirst(args);
        }

        if (!args.where.and) {
          args.where = {};
        }

        args.where.deletedAt = null;
        console.log(args.where);

        return Prisma.getExtensionContext(this).findFirst(args);
      },
      async upsertEx({ withDeleted, ...args }) {
        if (withDeleted) {
          return Prisma.getExtensionContext(this).upsert(args);
        }

        const context = Prisma.getExtensionContext(this);
        const deletedAt = getDataModel(context.name).fields.find(
          (field) => field.name === DELETED_AT_COLUMN,
        );

        if (!deletedAt) {
          return Prisma.getExtensionContext(this).upsert(args);
        }

        if (!args.where.not) {
          args.where.not = {};
        }

        args.where.not.deletedAt = null;

        return Prisma.getExtensionContext(this).upsert(args);
      },
    },
  },
});

function getDataModel(modelName: string) {
  return Prisma.dmmf.datamodel.models.find(
    (dataModel) => dataModel.name === modelName,
  );
}

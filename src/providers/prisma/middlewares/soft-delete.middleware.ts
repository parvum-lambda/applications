import { Prisma } from '.prisma/client';

import * as moment from 'moment';

export const softDeleteMiddleware: Prisma.Middleware = async <T = any>(
  params: Prisma.MiddlewareParams,
  next: (params: Prisma.MiddlewareParams) => Promise<T>,
) => {
  if (!params.args) {
    params.args = {};
  }

  if (!params.args.where) {
    params.args.where = {};
  }

  if (params.action == 'findUnique') {
    params.action = 'findFirst';
  }

  if (params.args.where.deletedAt === undefined) {
    params.args.where.deletedAt = null;
  }

  if (params.action == 'delete') {
    params.action = 'update';
    params.args.data = { deletedAt: moment().unix().toString() };
  } else if (params.action == 'deleteMany') {
    params.action = 'updateMany';

    if (params.args.data === undefined) {
      params.args.data = { deletedAt: moment().unix().toString() };
    } else {
      params.args.data.deletedAt = moment().unix().toString();
    }
  }

  return next(params);
};

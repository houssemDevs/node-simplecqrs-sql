import { decorate, inject, injectable } from 'inversify';
import { Ioc } from 'node-simplecqrs';

import { SqlQuery } from '../../../sql';
import { ITdsDataMapper, TdsConnectionConfig } from '../../../tedious';
import { TdsQueryHandler } from '../../../tedious/query/queryhandler';
import { TYPES } from '../constants';

decorate(injectable(), TdsQueryHandler);

@Ioc.queries(SqlQuery)
export class InversifyTdsQueryHandler<TEntity> extends TdsQueryHandler<TEntity> {
  constructor(
    @inject(TYPES.CONNECTION_CONFIG) config: TdsConnectionConfig,
    @inject(TYPES.DATAMAPPER) mapper: ITdsDataMapper<TEntity>
  ) {
    super(config, mapper);
  }
}

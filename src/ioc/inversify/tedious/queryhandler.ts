import { decorate, inject, injectable } from 'inversify';
import { Ioc } from 'node-simplecqrs';

import { ITdsDataMapper, TdsConnectionConfig } from '../../../tedious';
import { TdsQueryHandler } from '../../../tedious/query/queryhandler';
import { IocSqlQuery } from '../../query';
import { TYPES } from '../constants';

decorate(injectable(), TdsQueryHandler);

@Ioc.queries(IocSqlQuery)
export class InversifyTdsQueryHandler<TEntity> extends TdsQueryHandler<TEntity> {
  constructor(
    @inject(TYPES.connectionConfig) config: TdsConnectionConfig,
    @inject(TYPES.dataMapper) mapper: ITdsDataMapper<TEntity>
  ) {
    super(config, mapper);
  }
}

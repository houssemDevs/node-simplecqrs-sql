import { decorate, inject, injectable } from 'inversify';
import { queries } from 'node-simplecqrs';

import { ITdsDataMapper, TdsConnectionConfig } from '../../../tedious';
import { TdsQueryHandler } from '../../../tedious/query/queryhandler';
import { IocSqlQuery } from '../../query';
import { TYPES } from '../constants';

decorate(injectable(), TdsQueryHandler);

@queries(IocSqlQuery)
export class InversifyTdsQueryHandler<TEntity> extends TdsQueryHandler<
  TEntity
> {
  constructor(
    @inject(TYPES.connectionConfig) config: TdsConnectionConfig,
    @inject(TYPES.dataMapper) mapper: ITdsDataMapper<TEntity>,
  ) {
    super(config, mapper);
  }
}

import { IDateMapper } from 'node-simplecqrs';

export interface ISqlDataMapper<TDbEntity, TDomainEntity>
  extends IDateMapper<TDbEntity, TDomainEntity> {}

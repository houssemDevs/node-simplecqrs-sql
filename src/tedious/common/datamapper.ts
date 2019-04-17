import { ColumnValue } from 'tedious';

import { ISqlDataMapper } from '../../sql/common/datamapper';

export interface ITdsDataMapper<TDomainEntity>
  extends ISqlDataMapper<ColumnValue[], TDomainEntity> {}

export class TdsDefaultDataMapper implements ITdsDataMapper<{}> {
  public toDomain(s: ColumnValue[]): {} {
    return s.reduce((de, c) => ({ ...de, [c.metadata.colName]: c.value }), {});
  }
  public toStore(d: {}): ColumnValue[] {
    return [];
  }
}

import { IDateMapper } from 'node-simplecqrs';
import { ColumnValue } from 'tedious';

export interface ITdsDataMapper<TDomainEntity>
  extends IDateMapper<ColumnValue[], TDomainEntity> {}

export class TdsGenericDataMapper implements ITdsDataMapper<{}> {
  public toDomain(s: ColumnValue[]): {} {
    return s.reduce((de, c) => ({ ...de, [c.metadata.colName]: c.value }), {});
  }
  public toStore(d: {}): ColumnValue[] {
    return [];
  }
}

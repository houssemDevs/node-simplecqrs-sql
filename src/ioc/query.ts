import { Ioc } from 'node-simplecqrs';
import { SqlQuery } from '../sql';

@Ioc.query
export class IocSqlQuery extends SqlQuery {
  public static fromSelectStatment(statement: string): IocSqlQuery {
    return new IocSqlQuery(statement);
  }
  public static fromTableAndColumns(
    table: string,
    columns: string[],
  ): IocSqlQuery {
    let columnsString = '';
    if (columns.length > 1) {
      columnsString = columns.join(',');
    } else if (columns.length === 1) {
      columnsString = columns[0];
    } else {
      columnsString = '*';
    }
    return new IocSqlQuery(`SELECT ${columnsString} FROM ${table}`);
  }
  constructor(root: string) {
    super(root);
  }
}

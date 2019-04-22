import { ISqlWhereCriteria } from '../common/criteria';
import { ISqlCommand, SqlCommand } from './command';

/* #region  sql update command */
export interface ISqlUpdateCommand extends ISqlCommand {
  where(c: ISqlWhereCriteria): ISqlUpdateCommand;
  set(field: string, value: string): ISqlUpdateCommand;
}

export class SqlUpdateCommand extends SqlCommand implements ISqlUpdateCommand {
  public static fromTable(table: string) {
    return new SqlUpdateCommand(`UPDATE ${table}`);
  }

  private filterGroup: ISqlWhereCriteria[];
  private columns: Array<{ field: string; value: string }>;
  protected constructor(private expression: string) {
    super();
    this.filterGroup = [];
    this.columns = [];
  }

  public set(field: string, value: string): ISqlUpdateCommand {
    this.columns.push({ field, value });
    return this;
  }

  public toExpression(): string {
    const columnsClause = `SET ${this.columns
      .map(c => `${c.field} = ${c.value}`)
      .join(',')}`;

    const whereClause = `WHERE (${this.filterGroup
      .map(f => f.toExpression())
      .join(' AND ')})`;

    const sqlQuery = `${this.expression} ${columnsClause} ${whereClause};`;

    return sqlQuery;
  }

  public where(c: ISqlWhereCriteria): ISqlUpdateCommand {
    this.filterGroup.push(c);
    return this;
  }
}
/* #endregion */

import { ISqlWhereCriteria } from '../common/criteria';
import { ISqlCommand, SqlCommand } from './command';

/* #region  sql delete command */
export interface ISqlDeleteCommand extends ISqlCommand {
  where(c: ISqlWhereCriteria): ISqlDeleteCommand;
}

export class SqlDeleteCommand extends SqlCommand implements ISqlDeleteCommand {
  public static fromTable(table: string): ISqlDeleteCommand {
    return new SqlDeleteCommand(`DELETE FROM ${table}`);
  }
  constructor(private root: string, private filterGroup: ISqlWhereCriteria[] = []) {
    super();
  }
  public where(c: ISqlWhereCriteria): ISqlDeleteCommand {
    this.filterGroup.push(c);
    return this;
  }
  public toExpression(): string {
    const whereClause = this.filterGroup.map(c => c.toExpression()).join(' AND ');

    const sqlQuery = `${this.root} ${whereClause};`;

    return sqlQuery;
  }
}

/* #endregion */

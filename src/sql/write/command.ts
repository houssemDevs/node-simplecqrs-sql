import { ICommand } from 'node-simplecqrs';
import { ISqlWhereCriteria } from '../read/criteria';

export interface ISqlCommand extends ICommand {
  toExpression(): string;
}

export interface ISqlUpdateCommand extends ISqlCommand {
  where(c: ISqlWhereCriteria): ISqlUpdateCommand;
  set(field: string, value: string): ISqlUpdateCommand;
}

export interface ISqlDeleteCommand extends ISqlCommand {
  where(c: ISqlWhereCriteria): ISqlDeleteCommand;
}

export interface ISqlInsertCommand extends ISqlCommand {}

export class SqlUpdateCommand implements ISqlUpdateCommand {
  public static fromTable(table: string) {
    return new SqlUpdateCommand(`UPDATE ${table}`);
  }

  private filterGroup: ISqlWhereCriteria[];
  private columns: Array<{ field: string; value: string }>;
  protected constructor(private expression: string) {
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

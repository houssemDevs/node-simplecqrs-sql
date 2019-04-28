import { ISqlCommand, SqlCommand } from './command';

/* #region  sql insert command */
export interface ISqlInsertCommand extends ISqlCommand {
  addPair(fieldName: string, fieldValue: string): void;
}

export class SqlInsertCommand extends SqlCommand implements ISqlInsertCommand {
  constructor(private root: string, private fields: Array<[string, string]> = []) {
    super();
  }
  public addPair(fieldName: string, fieldValue: string): void {
    this.fields.push([fieldName, fieldValue]);
  }
  public toExpression(): string {
    const fields_values = this.fields.reduce(
      (obj: { f: string[]; v: string[] }, v) => {
        obj.f.push(v[0]);
        obj.v.push(v[1]);
        return obj;
      },
      { f: [], v: [] }
    );

    const sqlQuery = `${this.root} (${fields_values.f.join(',')}) VALUES (${fields_values.v.join(',')})`;

    return sqlQuery;
  }
}
/* #endregion */

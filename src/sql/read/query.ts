import { IQuery } from 'node-simplecqrs';

import { ISqlOrderByCriteria, ISqlWhereCriteria } from './criteria';

export interface ISqlSelectQuery
  extends IQuery<string, ISqlWhereCriteria, ISqlOrderByCriteria> {}

export class SqlSelectQuery implements ISqlSelectQuery {
  public static fromSelectStatment(statment: string): SqlSelectQuery {
    return new SqlSelectQuery(statment);
  }
  public static fromTableAndColumns(
    table: string,
    columns: string[],
  ): SqlSelectQuery {
    return new SqlSelectQuery(`SELECT ${columns.join(',')} FROM ${table}`);
  }
  private fitlerGroups: ISqlWhereCriteria[][];
  private currentFiltersGroup: ISqlWhereCriteria[];
  private sortGroup: ISqlOrderByCriteria[];
  protected constructor(private root: string) {
    this.fitlerGroups = [];
    this.sortGroup = [];
    this.currentFiltersGroup = [];
  }
  public addFilterCriteria(
    c: ISqlWhereCriteria,
  ): IQuery<string, ISqlWhereCriteria, ISqlOrderByCriteria> {
    this.currentFiltersGroup.push(c);
    return this;
  }
  public addSortCriteria(
    c: ISqlOrderByCriteria,
  ): IQuery<string, ISqlWhereCriteria, ISqlOrderByCriteria> {
    this.sortGroup.push(c);
    return this;
  }
  public beginNewFilterGroup(): IQuery<
    string,
    ISqlWhereCriteria,
    ISqlOrderByCriteria
  > {
    if (this.currentFiltersGroup.length > 0) {
      this.fitlerGroups.push(this.currentFiltersGroup);
      this.currentFiltersGroup = [];
    }
    return this;
  }
  public toExpression(): string {
    let whereClause: string = '';
    let orderByClause: string = '';

    // build where clause.
    this.beginNewFilterGroup();
    this.fitlerGroups.forEach((fg) => {
      if (whereClause.length === 0) {
        whereClause += `WHERE (${fg.map((c) => c.toExpression()).join(' AND ')})`;
      } else {
        whereClause += ` OR (${fg.map((c) => c.toExpression()).join(' AND ')})`;
      }
    });

    // build orderby clause.
    if (this.sortGroup.length > 0) {
      orderByClause = `ORDER BY ${this.sortGroup
        .map((s) => s.toExpression())
        .join(',')}`;
    }

    // compose the sql query.
    const sqlQuery: string = `${this.root} ${whereClause} ${orderByClause};`;

    return sqlQuery;
  }
}

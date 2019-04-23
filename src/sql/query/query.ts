import { IQuery } from 'node-simplecqrs';

import { ISqlOrderByCriteria, ISqlWhereCriteria } from '../common/criteria';

export interface ISqlQuery extends IQuery {
  where(fc: ISqlWhereCriteria): ISqlQuery;
  or(): ISqlQuery;
  orderBy(sc: ISqlOrderByCriteria): ISqlQuery;
  toExpression(): string;
}

export class SqlQuery implements ISqlQuery {
  public static fromSelectStatment(statment: string): ISqlQuery {
    return new SqlQuery(statment);
  }

  public static fromTableAndColumns(
    table: string,
    columns: string[],
  ): ISqlQuery {
    let columnsString = '';
    if (columns.length > 1) {
      columnsString = columns.join(',');
    } else if (columns.length === 1) {
      columnsString = columns[0];
    } else {
      columnsString = '*';
    }
    return new SqlQuery(`SELECT ${columnsString} FROM ${table}`);
  }

  private whereFilterGroups: ISqlWhereCriteria[][];
  private currentWhereFilterGroup: ISqlWhereCriteria[];
  private orderByGroup: ISqlOrderByCriteria[];
  private root: string;
  constructor(root: string) {
    this.currentWhereFilterGroup = [];
    this.orderByGroup = [];
    this.whereFilterGroups = [];
    this.root = root;
  }

  public where(fc: ISqlWhereCriteria): ISqlQuery {
    this.currentWhereFilterGroup.push(fc);
    return this;
  }

  public or(): ISqlQuery {
    if (this.currentWhereFilterGroup.length > 0) {
      this.whereFilterGroups.push(this.currentWhereFilterGroup);
      this.currentWhereFilterGroup = [];
    }
    return this;
  }

  public orderBy(sc: ISqlOrderByCriteria): ISqlQuery {
    this.orderByGroup.push(sc);
    return this;
  }

  public toExpression(): string {
    let whereClause: string = '';
    let orderByClause: string = '';

    // build where clause.
    this.or();
    this.whereFilterGroups.forEach(fg => {
      if (whereClause.length === 0) {
        whereClause += `WHERE (${fg.map(c => c.toExpression()).join(' AND ')})`;
      } else {
        whereClause += ` OR (${fg.map(c => c.toExpression()).join(' AND ')})`;
      }
    });

    // build orderby clause.
    if (this.orderByGroup.length === 1) {
      orderByClause = `ORDER BY ${this.orderByGroup[0].toExpression()}`;
    } else if (this.orderByGroup.length > 0) {
      orderByClause = `ORDER BY ${this.orderByGroup
        .map(s => s.toExpression())
        .join(',')}`;
    }

    // compose the sql query.
    const sqlQuery: string = `${this.root} ${whereClause} ${orderByClause};`;

    return sqlQuery;
  }
}

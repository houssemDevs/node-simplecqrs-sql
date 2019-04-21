export interface ISqlCriteria {
  toExpression(): string;
}

/* #region  sql where criteria */

export interface ISqlWhereCriteria extends ISqlCriteria {}

export class SqlWhereCriteria implements ISqlWhereCriteria {
  public static custom(
    field: string,
    value: string,
    operator: string,
  ): SqlWhereCriteria {
    return new SqlWhereCriteria(`${field} ${operator} ${value}`);
  }
  public static eq(field: string, value: string): SqlWhereCriteria {
    return this.custom(field, value, '=');
  }
  public static lt(field: string, value: string): SqlWhereCriteria {
    return this.custom(field, value, '<');
  }
  public static lte(field: string, value: string): SqlWhereCriteria {
    return this.custom(field, value, '<=');
  }
  public static gt(field: string, value: string): SqlWhereCriteria {
    return this.custom(field, value, '>');
  }
  public static gte(field: string, value: string): SqlWhereCriteria {
    return this.custom(field, value, '>=');
  }
  public static null(field: string): SqlWhereCriteria {
    return this.custom(field, 'NULL', 'IS');
  }
  public static notNull(field: string): SqlWhereCriteria {
    return this.custom(field, 'NULL', 'NOT');
  }
  public static like(field: string, value: string): SqlWhereCriteria {
    return this.custom(field, value, 'LIKE');
  }
  public static in(field: string, values: string[]): SqlWhereCriteria {
    return this.custom(field, `(${values.join(',')})`, 'IN');
  }
  protected constructor(private expression: string) {}
  public toExpression(): string {
    return this.expression;
  }
}
/* #endregion */

/* #region  sql orderby criteria */
export interface ISqlOrderByCriteria extends ISqlCriteria {}

export class SqlOrderByCriteria implements ISqlOrderByCriteria {
  public static asc(field: string): SqlOrderByCriteria {
    return new SqlOrderByCriteria(`${field} ASC`);
  }
  public static desc(field: string): SqlOrderByCriteria {
    return new SqlOrderByCriteria(`${field} DESC`);
  }
  protected constructor(private expression: string) {}
  public toExpression(): string {
    return this.expression;
  }
}
/* #endregion */

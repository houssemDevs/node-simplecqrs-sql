import { ICommand } from 'node-simplecqrs';

/* #region  base sql command */
export interface ISqlCommand extends ICommand {
  toExpression(): string;
}

export abstract class SqlCommand implements ISqlCommand {
  public abstract toExpression(): string;
}
/* #endregion */

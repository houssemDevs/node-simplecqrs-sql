import { ISqlWhereCriteria } from '../common/criteria';
import { ISqlCommand } from './command';

/* #region  sql delete command */
export interface ISqlDeleteCommand extends ISqlCommand {
  where(c: ISqlWhereCriteria): ISqlDeleteCommand;
}

/* #endregion */

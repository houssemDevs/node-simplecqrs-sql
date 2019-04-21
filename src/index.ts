export { ISqlDataMapper } from './sql/common/datamapper';
export {
  ISqlOrderByCriteria,
  ISqlWhereCriteria,
  SqlOrderByCriteria,
  SqlWhereCriteria,
} from './sql/common/criteria';

export { TdsConnectionConfig } from './types';
export {
  ITdsDataMapper,
  TdsDefaultDataMapper,
} from './tedious/common/datamapper';
export {
  TdsGenericQueryHandler,
  TdsQueryHandler,
} from './tedious/query/queryhandler';
export { TdsConnectionPool } from './tedious/connectionpool';

// TODO: implement IQueryHandler.
// TODO: test SqlCriterias Where and Sort.

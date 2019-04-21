import { decorate, injectable } from 'inversify';
import { queries, query } from 'node-simplecqrs';
import { SqlQuery } from '../../../sql/query/query';
import {
  TdsGenericQueryHandler,
  TdsQueryHandler,
} from '../../../tedious/query/queryhandler';

decorate(query, SqlQuery);
decorate(queries(SqlQuery), TdsQueryHandler);
decorate(injectable(), TdsQueryHandler);

import { IQueryHandler } from 'node-simplecqrs';
import { Readable } from 'stream';
import { Connection, Request } from 'tedious';

import { ISqlQuery } from '../../sql/query/query';
import { IConnectionPoolTask } from '../../types';
import { ITdsDataMapper, TdsGenericDataMapper } from '../common/datamapper';
import { TdsConnectionPool } from '../connectionpool';
import { TdsConnectionConfig } from '../types';

export class TdsQueryHandler<TEntity> implements IQueryHandler<TEntity> {
  private pool: TdsConnectionPool;
  private dataMapper: ITdsDataMapper<TEntity>;
  constructor(
    config: TdsConnectionConfig,
    datamapper: ITdsDataMapper<TEntity>,
  ) {
    this.pool = new TdsConnectionPool(config);
    this.dataMapper = datamapper;
  }

  public get(query: ISqlQuery): Promise<TEntity[]> {
    return this.pool.use(this._get(query.toExpression()));
  }

  public getStream(query: ISqlQuery): Readable {
    const rs = new Readable({ objectMode: true });

    this.pool.use(this._getStream(query.toExpression(), rs));

    return rs;
  }

  private _get(sqlQuery: string): IConnectionPoolTask<Connection> {
    return (connection: Connection): Promise<TEntity[]> =>
      new Promise((res, rej) => {
        const matches: TEntity[] = [];
        const request = new Request(sqlQuery, err => {
          if (err) {
            console.log(err);
            res([]);
          }
          res(matches);
        });
        request.on('row', row => matches.push(this.dataMapper.toDomain(row)));
        request.on('error', err => err);
        connection.execSql(request);
      });
  }

  private _getStream(
    sqlQuery: string,
    rs: Readable,
  ): IConnectionPoolTask<Connection> {
    return (connection: Connection): Promise<void> =>
      new Promise((res, rej) => {
        const request = new Request(sqlQuery, err => {
          if (err) {
            console.log(err);
          }
          rs.push(null);
          res();
        });
        request.on('row', row => rs.push(this.dataMapper.toDomain(row)));
        request.on('error', err => err);
        connection.execSql(request);
      });
  }
}

export class TdsGenericQueryHandler extends TdsQueryHandler<{}> {
  constructor(config: TdsConnectionConfig) {
    super(config, new TdsGenericDataMapper());
  }
}

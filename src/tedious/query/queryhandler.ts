import { IQueryHandler } from 'node-simplecqrs';
import { Readable } from 'stream';
import { Request } from 'tedious';

import { ISqlQuery } from '../../sql/query/query';
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
    return new Promise(async (res, rej) => {
      try {
        const matches: TEntity[] = [];
        const connection = await this.pool.acquire();
        const request = new Request(query.toExpression(), err => {
          if (err) {
            throw err;
          }
          res(matches);
          this.pool.release(connection);
        });
        request.on('row', row => matches.push(this.dataMapper.toDomain(row)));
        connection.execSql(request);
      } catch (err) {
        console.log(err.message);
        res([]);
      }
    });
  }

  public getStream(query: ISqlQuery): Readable {
    const rs = new Readable({ objectMode: true });
    // tslint:disable-next-line: no-empty
    rs._read = () => {};
    this.pool.acquire().then(connection => {
      const request = new Request(query.toExpression(), err => {
        if (err) {
          console.log(err.message);
        }
        rs.push(null);
        this.pool.release(connection);
      });
      request.on('row', row => rs.push(this.dataMapper.toDomain(row)));
      request.on('error', err => err);
      connection.execSql(request);
    });

    return rs;
  }
}

export class TdsGenericQueryHandler extends TdsQueryHandler<{}> {
  constructor(config: TdsConnectionConfig) {
    super(config, new TdsGenericDataMapper());
  }
}

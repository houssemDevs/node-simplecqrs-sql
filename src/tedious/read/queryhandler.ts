import { IQueryHandler } from 'node-simplecqrs';
import { Readable } from 'stream';
import { Request } from 'tedious';

import { ISqlSelectQuery } from '../../sql/read/query';
import { ITdsDataMapper, TdsDefaultDataMapper } from '../common/datamapper';
import { TdsConnectionPool } from '../connectionpool';

export class TdsQueryHandler<TEntity>
  implements IQueryHandler<TEntity, ISqlSelectQuery> {
  constructor(
    private pool: TdsConnectionPool,
    private datamapper: ITdsDataMapper<TEntity>,
  ) {}

  public get(query: ISqlSelectQuery): Promise<TEntity[]> {
    return new Promise(async (res, rej) => {
      try {
        const matches: TEntity[] = [];
        const connection = await this.pool.acquire();
        const request = new Request(query.toExpression(), err => {
          if (err) {
            throw err;
          }
          res(matches);
        });
        request.on('row', row => matches.push(this.datamapper.toDomain(row)));
        connection.execSql(request);
      } catch (err) {
        console.log(err.message);
        res([]);
      }
    });
  }

  public getStream(query: ISqlSelectQuery): Readable {
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
      request.on('row', row => rs.push(this.datamapper.toDomain(row)));
      request.on('error', err => console.log(err.message));
      connection.execSql(request);
    });

    return rs;
  }
}

export class TdsGenericQueryHandler extends TdsQueryHandler<{}> {
  constructor(pool: TdsConnectionPool) {
    super(pool, new TdsDefaultDataMapper());
  }
}

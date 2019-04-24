import { ICommandHandler } from 'node-simplecqrs';

import { Connection, Request } from 'tedious';
import { ISqlCommand } from '../../sql/command/command';
import { IConnectionPoolTask } from '../../types';
import { TdsConnectionPool } from '../connectionpool';
import { TdsConnectionConfig } from '../types';

export class TdsCommandHandler implements ICommandHandler {
  private pool: TdsConnectionPool;
  constructor(config: TdsConnectionConfig) {
    this.pool = new TdsConnectionPool(config);
  }

  public exec(c: ISqlCommand): Promise<boolean> {
    return this.pool.use(this._exec(c.toExpression()));
  }

  private _exec(sqlQuery: string): IConnectionPoolTask<Connection> {
    return (connection: Connection): Promise<boolean> =>
      new Promise((res, rej) => {
        const request = new Request(sqlQuery, err => {
          if (err) {
            rej(err);
          }
          res(true);
        });
        request.on('error', err => err);
        connection.execSql(request);
      });
  }
}

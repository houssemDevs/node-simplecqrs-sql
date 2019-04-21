import { ICommandHandler } from 'node-simplecqrs';

import { Request } from 'tedious';
import { ISqlCommand } from '../../sql/command/command';
import { TdsConnectionConfig } from '../../types';
import { TdsConnectionPool } from '../connectionpool';

export interface ITdsCommandHandler extends ICommandHandler {}

export class TdsCommandHandler implements ITdsCommandHandler {
  private pool: TdsConnectionPool;
  constructor(config: TdsConnectionConfig) {
    this.pool = new TdsConnectionPool(config);
  }

  public exec(c: ISqlCommand): Promise<boolean> {
    return new Promise<boolean>(async (res, rej) => {
      try {
        const connection = await this.pool.acquire();
        const request = new Request(c.toExpression(), err => {
          if (err) {
            rej(err);
          }
          res(true);
        });
        request.on('error', err => rej(err));
        connection.execSql(request);
      } catch (err) {
        rej(err);
      }
    });
  }
}

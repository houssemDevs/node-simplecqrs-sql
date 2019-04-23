import { createPool, Factory, Options, Pool } from 'generic-pool';
import { Connection, Request } from 'tedious';

import { IConnectionPool } from '../types';
import { TdsConnectionConfig } from './types';

class TdsConnectionFactory implements Factory<Connection> {
  constructor(private config: TdsConnectionConfig) {
    if (!this.config.authentication.type) {
      this.config.authentication.type = 'default';
    }
  }

  public create(): Promise<Connection> {
    return new Promise((res, rej) => {
      const cnn = new Connection(this.config);
      cnn.on('error', err => rej(err));
      cnn.on('connect', err => {
        if (err) {
          rej(err);
        }
        res(cnn);
      });
    });
  }

  public destroy(client: Connection): Promise<void> {
    client.close();
    return Promise.resolve();
  }

  public validate(client: Connection): Promise<boolean> {
    return new Promise(res => {
      const req = new Request('SELECT GETDATE();', err => {
        if (err) {
          res(false);
        }
        res(true);
      });
      req.on('error', () => res(false));
      client.execSql(req);
    });
  }
}

const defaultPoolOpts: Options = {
  max: 20,
  min: 2,
  testOnBorrow: true,
  acquireTimeoutMillis: 6000,
  autostart: true,
};

export class TdsConnectionPool implements IConnectionPool<Connection> {
  private pool: Pool<Connection>;
  constructor(
    private config: TdsConnectionConfig,
    opts: Options = defaultPoolOpts,
  ) {
    this.pool = createPool(new TdsConnectionFactory(config), opts);
  }

  public acquire(): Promise<Connection> {
    return Promise.resolve(this.pool.acquire());
  }

  public release(connection: Connection): void {
    this.pool.release(connection);
  }

  public destroy(connection: Connection): void {
    this.pool.destroy(connection);
  }

  public terminate(): void {
    this.pool.drain();
  }
}

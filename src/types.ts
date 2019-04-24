export interface IConnectionPool<TConnection> {
  acquire(): Promise<TConnection>;
  release(connection: TConnection): void;
  destroy(connection: TConnection): void;
  use(task: IConnectionPoolTask<TConnection>): Promise<any>;
  terminate(): void;
}

export type IConnectionPoolTask<TConnection> = (connection: TConnection) => Promise<any>;

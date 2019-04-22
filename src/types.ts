export interface IConnectionPool<TConnection> {
  acquire(): Promise<TConnection>;
  release(connection: TConnection): void;
  destroy(connection: TConnection): void;
  terminate(): void;
}

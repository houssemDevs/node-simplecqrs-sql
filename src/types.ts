import { ConnectionConfig } from 'tedious';

export interface IConnectionPool<TConnection> {
  acquire(): Promise<TConnection>;
  release(connection: TConnection): void;
  destroy(connection: TConnection): void;
  terminate(): void;
}

export interface TdsConnectionConfig extends ConnectionConfig {
  authentication: {
    type?: 'default' | 'ntlm' | 'azure-active-directory-password';
    options: {
      userName: string;
      password: string;
      domain?: string;
    };
  };
}

import { ConnectionConfig } from 'tedious';

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

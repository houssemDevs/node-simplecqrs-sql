import { command } from 'node-simplecqrs';
import { SqlUpdateCommand } from '../sql';

@command
export class IocSqlUpdateCommand extends SqlUpdateCommand {
  public static fromTable(table: string): IocSqlUpdateCommand {
    return new IocSqlUpdateCommand(`UPDATE ${table}`);
  }
  constructor(exp: string) {
    super(exp);
  }
}

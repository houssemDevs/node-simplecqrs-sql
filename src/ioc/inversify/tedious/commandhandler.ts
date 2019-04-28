import { decorate, inject, injectable } from 'inversify';
import { Ioc } from 'node-simplecqrs';

import { SqlDeleteCommand, SqlInsertCommand, SqlUpdateCommand } from '../../../sql';
import { TdsCommandHandler, TdsConnectionConfig } from '../../../tedious';
import { TYPES } from '../constants';

decorate(injectable(), TdsCommandHandler);

@Ioc.commands(SqlDeleteCommand, SqlUpdateCommand, SqlInsertCommand)
export class InvesrifyTdsCommandHandler extends TdsCommandHandler {
  constructor(@inject(TYPES.CONNECTION_CONFIG) config: TdsConnectionConfig) {
    super(config);
  }
}

import { decorate, inject, injectable } from 'inversify';
import { commands } from 'node-simplecqrs';

import { TdsCommandHandler, TdsConnectionConfig } from '../../../tedious';
import { IocSqlUpdateCommand } from '../../command';
import { TYPES } from '../constants';

decorate(injectable(), TdsCommandHandler);

@commands(IocSqlUpdateCommand)
export class InvesrifyTdsCommandHandler extends TdsCommandHandler {
  constructor(@inject(TYPES.connectionConfig) config: TdsConnectionConfig) {
    super(config);
  }
}

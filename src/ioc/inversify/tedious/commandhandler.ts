import { decorate, inject, injectable } from 'inversify';
import { Ioc } from 'node-simplecqrs';

import { TdsCommandHandler, TdsConnectionConfig } from '../../../tedious';
import { IocSqlUpdateCommand } from '../../command';
import { TYPES } from '../constants';

decorate(injectable(), TdsCommandHandler);

@Ioc.commands(IocSqlUpdateCommand)
export class InvesrifyTdsCommandHandler extends TdsCommandHandler {
  constructor(@inject(TYPES.connectionConfig) config: TdsConnectionConfig) {
    super(config);
  }
}

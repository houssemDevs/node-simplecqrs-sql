import { Ioc } from 'node-simplecqrs';
import { SqlDeleteCommand, SqlInsertCommand, SqlUpdateCommand } from '../sql';

Reflect.decorate([Ioc.command], SqlUpdateCommand);
Reflect.decorate([Ioc.command], SqlDeleteCommand);
Reflect.decorate([Ioc.command], SqlInsertCommand);

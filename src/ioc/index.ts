import * as Inversify from './inversify';

export { Inversify };

import { Ioc } from 'node-simplecqrs';
const { command, commands, queries, query } = Ioc;
export { queries, query, command, commands };

export { IocSqlUpdateCommand } from './command';

export { IocSqlQuery } from './query';

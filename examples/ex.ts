import 'reflect-metadata';

import {} from 'node-simplecqrs';

Reflect.defineMetadata('h', 2, Reflect);

import { Container } from 'inversify';
import { IoC, Tds } from '../lib/index';

const config: Tds.TdsConnectionConfig = {
  server: 'localhost',
  authentication: {
    options: {
      userName: 'sa',
      password: '1.0.5.1dre2015',
    },
  },
  options: {
    database: 'RCTC_CONSOLID_DRE',
  },
};

const container = new Container();
container.bind(IoC.Inversify.TYPES.connectionConfig).toConstantValue(config);
container
  .bind(IoC.Inversify.TYPES.dataMapper)
  .toConstantValue(new Tds.TdsGenericDataMapper());

const query = IoC.IocSqlQuery.fromSelectStatment(
  'select top 100 Code_Affaire, IntituleAffaire from Taffaire',
);

const dispatcher = new IoC.Inversify.InversifySqlQueryDispatcher(container);
let result = [];
(async () => {
  result = await dispatcher.dispatch(query);
  console.log(result);
  console.log(dispatcher);
})();

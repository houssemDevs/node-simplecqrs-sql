import 'reflect-metadata';

import { Container, decorate } from 'inversify';
import { IoC, SqlQuery, Tds } from '../src';

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

describe('dont know what to test', () => {
  let container: Container;
  beforeEach(() => {
    container = new Container();
    container
      .bind(IoC.Inversify.TYPES.connectionConfig)
      .toConstantValue(config);
    container
      .bind(IoC.Inversify.TYPES.dataMapper)
      .toConstantValue(new Tds.TdsGenericDataMapper());
  });
  it('should just work', async () => {
    const query = IoC.IocSqlQuery.fromSelectStatment(
      'select top 100 * from Taffaire',
    );
    expect(Reflect.getMetadataKeys(query.constructor)).toBeDefined();
    const dispatcher = new IoC.Inversify.InversifySqlQueryDispatcher(container);
    const result = await dispatcher.dispatch(query);
    expect(result.length).toBeGreaterThan(1);
  });
});

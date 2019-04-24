import 'reflect-metadata';

import { Container, decorate } from 'inversify';
import { IQueryHandler } from 'node-simplecqrs';
import { Readable } from 'stream';
import { Ioc, ISqlQuery, Tds } from '../src';
import { IocSqlQuery } from '../src/ioc';

class MockQueryHandler implements IQueryHandler<{}> {
  public get(q: ISqlQuery): Promise<Array<{}>> {
    return Promise.resolve([{ i: 1 }, { i: 2 }]);
  }
  public getStream(q: ISqlQuery): Readable {
    const rs = new Readable({ objectMode: true });
    let data = [{ i: 1 }, { i: 2 }];
    rs._read = () => {
      rs.push(data[0]);
      data = data.filter(v => v.i === 2);
    };
    return rs;
  }
}

decorate(Ioc.queries(IocSqlQuery), MockQueryHandler);

describe('dont know what to test', () => {
  it('should just work', async () => {
    const query = Ioc.IocSqlQuery.fromSelectStatment('select top 2 i from ist');
    const dispatcher = new Ioc.Inversify.InversifySqlQueryDispatcher(
      new Container(),
    );
    const array = await dispatcher.dispatch(query);
    expect(array.length).toEqual(2);
    expect(array[0]).toEqual({ i: 1 });
    expect(array[1]).toEqual({ i: 2 });

    const stream = dispatcher.dispatchStream(query);
    expect(stream.read()).toEqual({ i: 1 });
    expect(stream.read()).toEqual({ i: 2 });
  });
});

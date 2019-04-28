import { Ioc } from 'node-simplecqrs';
import { SqlQuery } from '../sql';

Reflect.decorate([Ioc.query], SqlQuery);

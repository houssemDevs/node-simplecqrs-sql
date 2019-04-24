import {
  ISqlQuery,
  SqlOrderByCriteria,
  SqlQuery,
  SqlWhereCriteria,
} from '../src/sql';

describe('SqlQuery', () => {
  describe('queries without criterias', () => {
    test('build a correct query from table and columns', () => {
      const query = SqlQuery.fromTableAndColumns('users', [
        'code',
        'firstname',
        'lastname',
      ]);
      expect(query.toExpression()).toMatch(
        /SELECT code,firstname,lastname FROM users\s*;/,
      );
    });
    test('build a correct query from select statement', () => {
      const query = SqlQuery.fromSelectStatment(
        'select code,firstname,lastname from users',
      );
      expect(query.toExpression()).toMatch(
        /select code,firstname,lastname from users\s*;/,
      );
    });
  });
  describe('queries with criterias', () => {
    let query: ISqlQuery;
    beforeEach(() => {
      query = SqlQuery.fromSelectStatment('select code from users');
    });
    it('should build a correct query with filters', () => {
      query.where(SqlWhereCriteria.eq('code', '12345'));

      expect(query.toExpression()).toMatch(
        /^select code from users WHERE \(code = 12345\) ;$/,
      );

      query.or().where(SqlWhereCriteria.eq('code', '345678'));

      expect(query.toExpression()).toMatch(
        /^select code from users WHERE \(code = 12345\) OR \(code = 345678\) ;$/,
      );
    });

    it('shoult build correct query with sorts', () => {
      query.orderBy(SqlOrderByCriteria.asc('code'));

      expect(query.toExpression()).toMatch(
        /^select code from users  ORDER BY code ASC;$/,
      );

      query.orderBy(SqlOrderByCriteria.desc('code'));

      expect(query.toExpression()).toMatch(
        /^select code from users  ORDER BY code ASC,code DESC;$/,
      );
    });
  });
});

import { SqlOrderByCriteria, SqlWhereCriteria } from '../src/sql/read/criteria';
import { SqlSelectQuery } from '../src/sql/read/query';

describe('SqlSelectQuery', () => {
  describe('queries without criterias', () => {
    test('build a correct query from table and columns', () => {
      const query = SqlSelectQuery.fromTableAndColumns('users', [
        'code',
        'firstname',
        'lastname',
      ]);
      expect(query.toExpression()).toMatch(
        /SELECT code,firstname,lastname FROM users\s*;/,
      );
    });
    test('build a correct query from select statement', () => {
      const query = SqlSelectQuery.fromSelectStatment(
        'select code,firstname,lastname from users',
      );
      expect(query.toExpression()).toMatch(
        /select code,firstname,lastname from users\s*;/,
      );
    });
  });
  describe('queries with criterias', () => {
    let query: SqlSelectQuery;
    beforeEach(() => {
      query = SqlSelectQuery.fromSelectStatment('select code from users');
    });
    test('build a correct query with filters', () => {
      query.addFilterCriteria(SqlWhereCriteria.eq('code', '12345'));

      expect(query.toExpression()).toMatch(
        /^select code from users WHERE \(code = 12345\) ;$/,
      );

      query
        .beginNewFilterGroup()
        .addFilterCriteria(SqlWhereCriteria.eq('code', '345678'));

      expect(query.toExpression()).toMatch(
        /^select code from users WHERE \(code = 12345\) OR \(code = 345678\) ;$/,
      );
    });

    test('build correct query with sorts', () => {
      query.addSortCriteria(SqlOrderByCriteria.asc('code'));

      expect(query.toExpression()).toMatch(
        /^select code from users  ORDER BY code ASC;$/,
      );

      query.addSortCriteria(SqlOrderByCriteria.desc('code'));

      expect(query.toExpression()).toMatch(
        /^select code from users  ORDER BY code ASC, ;$/,
      );
    });
  });
});

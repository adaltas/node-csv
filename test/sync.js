const csv = require('../lib/sync');

describe('api sync', () => {
  it('expose generate', () => {
    return csv.generate({ length: 10, objectMode: true }).length.should.eql(10);
  });

  it('expose parse', () => {
    return csv.parse('a,b,c\n1,2,3\n').should.eql([['a', 'b', 'c'], ['1', '2', '3']]);
  });

  it('expose transform', () => {
    return csv
      .transform([['a', 'b', 'c'], ['1', '2', '3']], record => {
        record.push(record.shift());
        return record;
      })
      .should.eql([['b', 'c', 'a'], ['2', '3', '1']]);
  });

  it('expose stringify', () => {
    return csv.stringify([['a', 'b', 'c'], ['1', '2', '3']]).should.eql('a,b,c\n1,2,3\n');
  });
});

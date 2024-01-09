
import assert from 'node:assert';
import { parse } from 'csv-parse';

parse(`
friend,username,friend
athos,porthos,aramis
porthos,d_artagnan,athos
`.trim(), {
  columns: true,
  group_columns_by_name: true
}, function(err, records){
  assert.deepStrictEqual(
    records, [{
      username: 'porthos',
      friend: ['athos', 'aramis']
    }, {
      username: 'd_artagnan',
      friend: ['porthos', 'athos']
    }]
  );
});

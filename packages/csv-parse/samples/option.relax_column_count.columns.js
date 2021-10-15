
import assert from 'assert';
import { parse } from 'csv-parse';

parse(`
lastname,firstname,fullname
Ritchie
Lovelace,Ada,"Augusta Ada King, Countess of Lovelace"
`.trim(), {
  relax_column_count: true,
  columns: true
}, function(err, records){
  assert.deepStrictEqual(
    records, [
      { lastname: 'Ritchie' },
      { lastname: 'Lovelace',
        firstname: 'Ada',
        fullname: 'Augusta Ada King, Countess of Lovelace' }
    ]
  );
});

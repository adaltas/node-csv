
import assert from 'assert';
import { parse } from 'csv-parse/sync';

const records = parse('1,2\nin:va:lid\n3,4', {
  columns: ['a', 'b'],
  relax_column_count: true,
  raw: true,
  on_record: ({raw, record}, {error}) => {
    if(error && error.code === 'CSV_RECORD_INCONSISTENT_COLUMNS'){
      return raw.trim().split(':');
    } else {
      return record;
    }
  }
});
assert.deepStrictEqual(
  records, [
    { a: '1', b: '2' },
    [ 'in', 'va', 'lid' ],
    { a: '3', b: '4' }
  ]
);


import assert from 'assert';
import { parse } from 'csv-parse/sync';

const records = parse('1,2\nin:va:lid\n3,4', {
  relax_column_count: true,
  raw: true,
  on_record: ({raw, record}, {error}) => {
    if(error && error.code === 'CSV_INCONSISTENT_RECORD_LENGTH'){
      return raw.trim().split(':');
    } else {
      return record;
    }
  }
});
assert.deepStrictEqual(
  records, [
    [ '1', '2' ],
    [ 'in', 'va', 'lid' ],
    [ '3', '4' ]
  ]
);

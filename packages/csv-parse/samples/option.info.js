
import assert from 'assert';
import { parse } from 'csv-parse/sync';

const data = "a,b,c";
const records = parse(data, {
  info: true
});
assert.deepStrictEqual(records, [{
  info: {
    bytes: 5,
    comment_lines: 0,
    empty_lines: 0,
    invalid_field_length: 0,
    lines: 1,
    records: 1,
    columns: false,
    error: undefined,
    header: false,
    index: 3
  },
  record: [ 'a', 'b', 'c' ]
}]);

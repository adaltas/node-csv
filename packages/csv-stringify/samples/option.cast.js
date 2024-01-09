
import assert from 'node:assert';
import { stringify } from 'csv-stringify/sync';

const data = stringify([ [1], [2] ], {
  cast: {
    number: function(value){
      return {value: `="${value}"`, quote: false};
    }
  }
});

assert.equal(data, '="1"\n="2"\n');

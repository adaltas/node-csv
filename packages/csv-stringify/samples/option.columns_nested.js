
import { stringify } from 'csv-stringify';
import assert from 'node:assert';

stringify([{
  an_array: [{
  }, {
    field_2: '1_val_1'
  }],
  an_object: {
    field_4: '1_val_2'
  }
},{
  an_array: [{
  }, {
    field_2: '2_val_1'
  }],
  an_object: {
    field_4: '2_val_2'
  }
}], {columns: [
  'an_object.field_4',
  'an_array[1].field_2'
]}, (err, records) => {
  assert.equal(records, '1_val_2,1_val_1\n2_val_2,2_val_1\n');
});

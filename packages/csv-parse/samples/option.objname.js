
import assert from 'assert'
import { parse } from 'csv-parse'

parse('ColumnOne,ColumnTwo\nfirst,Data\nsecond,MoreData', {
  columns: true,
  objname: 'ColumnOne'
}, function(err, data){
    if(err) throw err;
    assert.deepStrictEqual(data, {
      first: { ColumnOne: 'first', ColumnTwo: 'Data' },
      second: { ColumnOne: 'second', ColumnTwo: 'MoreData' } 
    })
  }
);

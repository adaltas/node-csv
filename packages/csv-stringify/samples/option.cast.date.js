
import { stringify } from 'csv-stringify';
import assert from 'assert';

stringify([{
  name: 'foo',
  date: new Date('1970-01-01T00:00:00.000Z')
},{
  name: 'bar',
  date: new Date('1971-01-01T00:00:00.000Z')
}],{
  cast: {
    date: function(value) {
      return value.toISOString();
    }
  }
}, function(err, data) {
  assert.equal(
    data,
    "foo,1970-01-01T00:00:00.000Z\n" +
    "bar,1971-01-01T00:00:00.000Z\n"
  );
});
